import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import PrimaryButton from "../../ui/shared/PrimaryButton";
import SocialLogin from "../../ui/shared/SocialLogin";
import useAuth from "../../hooks/useAuth";
import { IoIosLogIn } from "react-icons/io";

const Login = () => {

    const { user, emailSignIn } = useAuth()

    const location = useLocation();
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {

        const email = data.email;
        const password = data.password;

        setIsSubmitting(true)

        emailSignIn(email, password)
            .then(() => {
                setIsSubmitting(false)
                toast.success("Successfully Login!");
                navigate(location?.state ? location.state : "/");
            })
            .catch((error) => {
                setIsSubmitting(false)
                toast.error(error.message);
            });
    };


    useEffect(() => {
        if (user) {
            navigate(location.state || "/");
        }
    }, [location.state, navigate, user]);

    return (
        <div>
            <div className="container">
                <div className="max-w-lg rounded-lg shadow-lg mx-auto text-center mt-10 lg:mt-20 lg:p-10 p-7">
                    <div className="space-y-3">
                        <p className="text-navyBlue">Login</p>
                        <h3>Welcome Back!</h3>
                        <p>Access your account by signing in</p>
                        <SocialLogin />
                    </div>

                    <div className="flex items-center my-7">
                        <div className="flex-1 border-t border-gray-400"></div>
                        <h5 className="mx-4">Or</h5>
                        <div className="flex-1 border-t border-gray-400"></div>
                    </div>


                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                                <p className="text-red mt-1 text-sm">{errors.email.message}</p>
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
                                <p className="text-red mt-1 text-sm">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-navyBlue underline text-sm">
                                Forgot password?
                            </Link>
                        </div>

                        <div className="flex items-center justify-center">
                            <PrimaryButton
                                icon={isSubmitting ? <div className="w-4 h-4 animate-[spin_2s_linear_infinite] rounded-full border-2 border-dashed border-white"></div> : <IoIosLogIn />}
                                title={"Login"} />
                        </div>

                        <p className="mt-4 text-sm">
                            Don’t have an Account? Create account{" "}
                            <Link to="/register" className="text-navyBlue underline">
                                Register
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;