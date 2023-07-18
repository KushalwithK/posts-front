import { useContext, useLayoutEffect, useState } from "react";
import { API_SINGLETON } from "../extras/Constant";
import { Link, useNavigate } from "react-router-dom";
import { data } from "autoprefixer";
import { AppContext } from "../AppContext";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [registerData, setregisterData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        firstName: null,
        lastName: null,
        email: null,
        password: null,
    });
    const navigate = useNavigate();

    const { validateUser } = useContext(AppContext)

    // const { user, setUser } = useContext(AppContext);

    const [cookies, setCookie, getCookie] = useCookies("jwt");

    const handleRegister = async (event) => {

        event.preventDefault();
        if (registerData.password == "" || registerData.firstName == "" || registerData.lastName == "" || registerData.email == "") {
            setErrors({
                ...errors,
                firstName: "First Name cannot be empty!",
                lastName: "Last Name cannot be empty!",
                email: "Email cannot be empty!",
                password: "Password cannot be empty!",
            });
            toast.error('Pls fill out the * fields', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
        else setErrors({ ...errors, password: null });

        console.log(registerData);
        if (registerData.firstName != "" && registerData.lastName != "" && registerData.email != "" && registerData.password != "") {
            var formData = new FormData();
            formData.append("firstName", registerData.firstName);
            formData.append("lastName", registerData.lastName);
            formData.append("email", registerData.email);
            formData.append("rawPassword", registerData.password);
            API_SINGLETON.post("/register/", formData)
                .then(async (response) => {
                    if (response.data.status == "USER REGISTERED AND AUTHENTICATED") {
                        console.log("User registered!");
                        toast.success('Registered successfully, please login!', {
                            position: "bottom-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                        });
                        navigate('/login')
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setErrors({
                        ...errors,
                        firstName: "Some credentials are incorrect",
                        lastName: "Some credentials are incorrect",
                        email: "Some credentials are incorrect",
                        password: "Some credentials are incorrect",
                    });
                });
        }
    };

    return (
        <main className="w-full h-screen flex flex-col items-center justify-center px-4">
            <ToastContainer />
            <div className="max-w-sm w-full text-gray-600">
                <div className="text-center">

                    <div className="mt-5 space-y-2">
                        <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
                            Register a new account
                        </h3>
                        <p className="">Enter your credentials to continue!</p>
                    </div>
                </div>
                <form onSubmit={handleRegister} className="mt-8 space-y-5">
                    <div>
                        <label className="font-medium">First Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="ex. John"
                            onChange={(e) => {
                                setregisterData({ ...registerData, firstName: e.currentTarget.value });
                            }}
                            className={`w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border ${errors.firstName != null ? "border-red-500" : ""
                                } focus:border-indigo-600 shadow-sm rounded-lg`}
                        />
                        {(registerData.firstName == "" || errors.firstName) && (
                            <p className="text-red-500 mt-1">{errors.firstName}</p>
                        )}
                    </div>
                    <div>
                        <label className="font-medium">Last Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="username"
                            placeholder="ex. Dave"
                            onChange={(e) => {
                                setregisterData({ ...registerData, lastName: e.currentTarget.value });
                            }}
                            className={`w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border ${errors.lastName != null ? "border-red-500" : ""
                                } focus:border-indigo-600 shadow-sm rounded-lg`}
                        />
                        {(registerData.lastName == "" || errors.lastName) && (
                            <p className="text-red-500 mt-1">{errors.lastName}</p>
                        )}
                    </div>
                    <div>
                        <label className="font-medium">Email <span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            name="email"
                            placeholder="ex. personal@mail.com"
                            onChange={(e) => {
                                setregisterData({ ...registerData, email: e.currentTarget.value });
                            }}
                            className={`w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border ${errors.email != null ? "border-red-500" : ""
                                } focus:border-indigo-600 shadow-sm rounded-lg`}
                        />
                        {(registerData.email == "" || errors.email) && (
                            <p className="text-red-500 mt-1">{errors.email}</p>
                        )}
                    </div>
                    <div>
                        <label className="font-medium">Password <span className="text-red-500">*</span></label>
                        <input
                            type="password"
                            name="password"
                            placeholder="ex. 12345678"
                            onChange={(e) => {
                                setregisterData({ ...registerData, password: e.currentTarget.value });
                            }}
                            className={`w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border ${errors.password != null ? "border-red-500" : ""
                                } focus:border-indigo-600 shadow-sm rounded-lg`}
                        />
                        {(registerData.password == "" || errors.password) && (
                            <p className="text-red-500 mt-1">{errors.password}</p>
                        )}
                    </div>
                    <button className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150">
                        Register
                    </button>
                    <div className="text-center">
                        <p >
                            Already have an account? <Link className="hover:text-indigo-600 hover:font-bold" to={'/login'}>Login</Link>
                        </p>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Login;
