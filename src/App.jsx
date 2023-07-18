import React, { useState, useEffect } from "react";
import Posts from "./components/Posts";
import CreatePost from "./components/CreatePost";
import UpdatePost from "./components/UpdatePost";
import Login from "./components/Login";
import Register from "./components/Register";
import Todos from "./components/Todos";
import UpdateTodo from "./components/UpdateTodo";
import {
  Outlet,
  Route,
  Routes,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { styled } from "styled-components";
import SidebarItem from "./components/subComponents/SidebarItem";
import { AppContext } from "./AppContext";
import { API_SINGLETON } from "./extras/Constant";
import { useCookies } from "react-cookie";
import GuardedRoute from "./routing/GuardedRoute";

const App = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const validateUser = () => {
    if (localStorage.getItem("username") && localStorage.getItem("password")) {
      setIsAuthenticated(true);
      const formData = new FormData();
      formData.append("username", localStorage.getItem("username"));
      formData.append("password", localStorage.getItem("password"));
      API_SINGLETON.post("/validateUser/", formData)
        .then((response) => {
          if (response.data.status == "USER IS VALID") {
            setUser(response.data.user);
            setIsAuthenticated(true);
            navigate('/')
          }
        })
        .catch((error) => {
          if (error) setIsAuthenticated(false);
        });
    } else {
      console.log("Login credentials cannot be found, please login!");
    }
  };

  const getUsers = () => {
    API_SINGLETON.get("/users", {
      username: localStorage.getItem("username"),
      password: localStorage.getItem("password"),
    })
      .then((response) => {
        const users = response.data;
        setUsers(users);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    console.log(location.pathname);
    validateUser();
    getUsers();
  }, []);

  return (
    <Main>
      <AppContext.Provider value={{ user, validateUser, users, setIsAuthenticated }}>
        <Routes>
          <Route
            element={
              <GuardedRoute
                isRouteAccessible={isAuthenticated}
                redirectRoute="/login"
              />
            }
          >
            {/* Posts */}
            <Route path="/" element={<Posts />} />
            <Route path="/posts/create" element={<CreatePost />} />
            <Route path="/posts/update/:postId" element={<UpdatePost />} />

            {/* Todos */}
            <Route path="/todos" element={<Todos />} />
            <Route path="/todos/update/:todoId" element={<UpdateTodo />} />
          </Route>

          <Route
            element={
              <GuardedRoute
                isRouteAccessible={!isAuthenticated}
                redirectRoute="/"
                login
              />
            }
          >
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </AppContext.Provider>
    </Main>
  );
};

const Main = styled.div`
  display: flex;
  height: 100vh;
`;

export default App;
