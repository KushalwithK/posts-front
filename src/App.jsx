import React from "react";
import Posts from "./components/Posts";
import CreatePost from "./components/CreatePost";
import UpdatePost from "./components/UpdatePost";
import Login from "./components/Login";
import Todos from "./components/Todos";
import UpdateTodo from "./components/UpdateTodo";
import { Outlet, Route, Routes } from "react-router-dom";
import { styled } from "styled-components";
import SidebarItem from "./components/subComponents/SidebarItem";

const Layout = () => {
  return (
    <>
      <SidebarItem />
      <Outlet />
    </>
  );
};

const App = () => {
  return (
    <Main>
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
    </Main>
  );
};

const Main = styled.div`
  display: flex;
`;

export default App;
