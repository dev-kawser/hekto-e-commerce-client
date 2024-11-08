import { Link, useLocation, useNavigate } from "react-router-dom";
import PrimaryButton from "../../ui/shared/PrimaryButton";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { updateProfile } from "firebase/auth";
import SocialLogin from "../../ui/shared/SocialLogin";
import { IoIosLogIn } from "react-icons/io";


const Register = () => {

    const { emailRegister } = useAuth()

    const navigate = useNavigate();
    const location = useLocation();

    const [showPassword, setShowPassword] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ml_default");
        formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

        setIsUploading(true);
        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME
                }/image/upload`,
                formData
            );
            setImageUrl(response.data.secure_url);
        } catch (error) {
            console.error("Image upload failed", error);
        } finally {
            setIsUploading(false);
        }
    };

    // Register with email password authentication
    const onSubmit = async (data) => {
        const email = data.email;
        const password = data.password;
        const name = data.fullName;

        const userInfo = {
            name: name,
            email: email,
            image: imageUrl,
        };

        setIsSubmitting(true)
        console.log(userInfo, password);

        try {
            const result = await emailRegister(email, password);
            await updateProfile(result.user, {
                displayName: name,
                photoURL: imageUrl,
            })
                .then(() => {
                    setIsSubmitting(false)
                    toast.success("Successfully Register");
                    navigate(location?.state ? location.state : "/");
                })
                .catch((error) => {
                    setIsSubmitting(false)
                    toast.error(error.message);
                });
        } catch (error) {
            toast.error(error.message);
        }
    };


    return (
        <div>
            <div className="container">
                <div className="max-w-xl rounded-lg shadow-lg mx-auto text-center mt-10 lg:mt-20 lg:p-10 p-7">
                    <div className="space-y-3">
                        <p className="text-navyBlue">Register</p>
                        <h3>Start For Free Today</h3>
                        <p>Access to all features, no credit card required</p>
                        <SocialLogin />
                    </div>

                    <div className="flex items-center my-7">
                        <div className="flex-1 border-t border-gray-400"></div>
                        <h5 className="mx-4">Or</h5>
                        <div className="flex-1 border-t border-gray-400"></div>
                    </div>


                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label
                                htmlFor="fullName"
                                className="block text-left font-medium pb-1"
                            >
                                Full Name*
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                placeholder="Full Name"
                                {...register("fullName", { required: "Full name is required" })}
                                className="input input-bordered border rounded py-2 px-2 w-full"
                            />
                            {errors.fullName && (
                                <p className="text-red text-sm">{errors.fullName.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-left font-medium pb-1">
                                Email*
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                        message: "Email is not valid",
                                    },
                                })}
                                className="input input-bordered border rounded py-2 px-2 w-full"
                            />
                            {errors.email && (
                                <p className="text-red text-sm">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="photo" className="block text-left font-medium pb-1">
                                Upload Photo*
                            </label>
                            <input
                                type="file"
                                id="photo"
                                onChange={(e) => handleImageUpload(e.target.files[0])}
                                className="input input-bordered border rounded py-2 px-2 w-full"
                            />
                            {isUploading && <div className="mt-2 w-10 h-10 animate-[spin_2s_linear_infinite] rounded-full border-4 border-dashed border-sky-600"></div>}
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt="Uploaded"
                                    className="mt-3 size-24 rounded"
                                />
                            )}
                        </div>

                        <div className="relative">
                            <label
                                htmlFor="password"
                                className="block text-left font-medium pb-1"
                            >
                                Password*
                            </label>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                {...register("password", {
                                    required: "Password is required",
                                    pattern: {
                                        value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]:;"'<>,.?/\\|`~_-]).+$/,
                                        message: "Password must contain at least one uppercase letter, one number, and one special character (@, #, $, %, etc.)",
                                    }
                                })}
                                className="input input-bordered border rounded py-2 px-2 w-full"
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute text-18 top-11 right-5"
                            >
                                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </span>
                            {errors.password && (
                                <p className="text-red text-sm">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-center">
                            <PrimaryButton
                                icon={isSubmitting ? <div className="w-4 h-4 animate-[spin_2s_linear_infinite] rounded-full border-2 border-dashed border-white"></div> : <IoIosLogIn />}
                                title={"Register"} />
                        </div>

                        <p className="mt-4 text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="text-navyBlue underline">
                                Sign In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;