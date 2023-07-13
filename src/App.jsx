import React, { useState } from "react";
import Posts from "./components/Posts";
import CreatePost from "./components/CreatePost";
import UpdatePost from "./components/UpdatePost";
import Login from "./components/Login";
import Todos from "./components/Todos";
import UpdateTodo from "./components/UpdateTodo";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import SidebarItem from "./components/subComponents/SidebarItem";
import { AppContext } from "./AppContext";
import { API_SINGLETON } from "./extras/Constant";
import { useCookies } from "react-cookie";

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

  const navigate = useNavigate();

  const validateUser = () => {
    if (user != null) {
      const formData = new FormData();
      formData.append("username", user.username);
      formData.append("password", user.rawPassword);
      API_SINGLETON.post("/validateUser/", formData).then((response) => {
        const data = response.data;
        console.log(data);
        if (data.status != "USER IS VALID") {
          navigate("/login");
        }
      });
    } else {
      navigate("/login");
    }
  };

  return (
    <Main>
      <AppContext.Provider value={{ user, setUser, validateUser }}>
        <Routes>
          <Route element={<Layout />}>
            {/* Posts */}
            <Route path="/" element={<Posts />} />
            <Route path="/posts/create" element={<CreatePost />} />
            <Route path="/posts/update/:postId" element={<UpdatePost />} />

            {/* Todos */}
            <Route path="/todos" element={<Todos />} />
            <Route path="/todos/update/:todoId" element={<UpdateTodo />} />
          </Route>
          <Route path="/login" element={<Login />} />
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
