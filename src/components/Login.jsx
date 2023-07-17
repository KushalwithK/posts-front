import { useContext, useLayoutEffect, useState } from "react";
import { API_SINGLETON } from "../extras/Constant";
import { useNavigate } from "react-router-dom";
import { data } from "autoprefixer";
import { AppContext } from "../AppContext";
import { useCookies } from "react-cookie";

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: null,
    password: null,
  });
  const navigate = useNavigate();

  // const { user, setUser } = useContext(AppContext);

  const [cookies, setCookie, getCookie] = useCookies("jwt");

  const handleLogin = async (event) => {
    event.preventDefault();
    if (loginData.password == "" || loginData.username == "")
      setErrors({
        ...errors,
        username: "Username cannot be empty!",
        password: "Password cannot be empty!",
      });
    else setErrors({ ...errors, password: null });

    console.log(loginData);
    if (loginData.username != "" && loginData.password != "") {
      var formData = new FormData();
      formData.append("username", loginData.username);
      formData.append("password", loginData.password);
      API_SINGLETON.post("/validateUser/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(async (response) => {
          if (response.data.status == "USER IS VALID") {
            console.log("User is valid!");
            localStorage.setItem("username", loginData.username);
            localStorage.setItem("password", loginData.password);
            navigate("/");
          }
        })
        .catch((error) => {
          console.log(error);
          setErrors({
            ...errors,
            username: "Username or password is incorrect",
            password: "Username or password is incorrect",
          });
        });
    }
  };

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full text-gray-600">
        <div className="text-center">
          {/* <img
            src="https://floatui.com/logo.svg"
            width={150}
            className="mx-auto"
          /> */}
          <div className="mt-5 space-y-2">
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
              Log in to your account
            </h3>
            <p className="">Enter your credentials to login!</p>
          </div>
        </div>
        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="font-medium">Username</label>
            <input
              type="name"
              name="username"
              placeholder="ex. John Dave"
              onChange={(e) => {
                setLoginData({ ...loginData, username: e.currentTarget.value });
              }}
              className={`w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border ${
                errors.username != null ? "border-red-500" : ""
              } focus:border-indigo-600 shadow-sm rounded-lg`}
            />
            {(loginData.username == "" || errors.username) && (
              <p className="text-red-500 mt-1">{errors.username}</p>
            )}
          </div>
          <div>
            <label className="font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="ex. 12345678"
              onChange={(e) => {
                setLoginData({ ...loginData, password: e.currentTarget.value });
              }}
              className={`w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border ${
                errors.password != null ? "border-red-500" : ""
              } focus:border-indigo-600 shadow-sm rounded-lg`}
            />
            {(loginData.password == "" || errors.password) && (
              <p className="text-red-500 mt-1">{errors.password}</p>
            )}
          </div>
          <button className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150">
            Log in
          </button>
          <div className="text-center">
            <a href="#" className="hover:text-indigo-600">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;
