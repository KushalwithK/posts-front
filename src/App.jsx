import React, { useState, useEffect } from "react";
import Posts from "./components/Posts";
import CreatePost from "./components/CreatePost";
import UpdatePost from "./components/UpdatePost";
import Login from "./components/Login";
import Todos from "./components/Todos";
import UpdateTodo from "./components/UpdateTodo";
import {
  Outlet,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { styled } from "styled-components";
import SidebarItem from "./components/subComponents/SidebarItem";
import { AppContext } from "./AppContext";
import { API_SINGLETON } from "./extras/Constant";
import { useCookies } from "react-cookie";
import GuardedRoute from "./routing/GuardedRoute";

const Layout = () => {
  return (
    <>
      <SidebarItem />
      <Outlet />
    </>
  );
};
const App = () => {
  const [user, setUser] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const location = useLocation();

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
          }
        })
        .catch((error) => {
          if (error) setIsAuthenticated(false);
        });
    } else {
      console.log("Login credentials cannot be found, please login!");
    }
  };

  useEffect(() => {
    console.log(location.pathname);
    validateUser();
  }, []);

  return (
    <Main>
      <AppContext.Provider value={{ user, setUser, validateUser }}>
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
