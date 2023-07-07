import React, { useEffect, useRef, useState } from "react";
import { Table } from "flowbite-react";
import { CREATE_POST_ROUTE, UPDATE_POST_ROUTE } from "../extras/Routes";
import { Label, TextInput } from "flowbite-react";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import { API_SINGLETON } from "../extras/Constant";
import { Dropdown } from "flowbite-react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Link } from "react-router-dom";

const Todos = () => {
  const [todoDate, setTodoDate] = useState({
    date: null,
  });

  const [todoTitle, setTodoTitle] = useState({
    title: null,
  });

  const contentRef = useRef();

  const [todos, setTodos] = useState([]);

  const handleDateChange = (event) => {
    API_SINGLETON.get("/todos/sort/", {
      params: { date: event.currentTarget.value },
    })
      .then((response) => {
        console.log(response.data);
        setTodos(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleTodoDelete = (id) => {
    API_SINGLETON.delete("/todos/" + id)
      .then((response) => {
        console.log(response);
        getTodos();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDateReset = () => {
    getTodos();
  };

  const getTodos = () => {
    API_SINGLETON.get("/todos").then((response) => {
      console.log(response.data);
      setTodos(response.data);
    });
  };

  const handleTodoAdd = () => {
    if (todoTitle.title == null) setTodoTitle({ ...todoTitle, title: "" });
    else if (todoTitle.title != "") {
      const formData = new FormData();
      formData.append("title", todoTitle.title);
      API_SINGLETON.post("/todos/", formData).then((response) => {
        console.log(response.data);
        getTodos();
        setTodoTitle({ ...todoTitle, title: null });
        contentRef.current.value = "";
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") handleTodoAdd();
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="w-full pt-10 p-10">
      <div className="items-center justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
            TODO's
          </h3>
          <p className="text-gray-600 mt-2">List of all TODO's by You</p>
        </div>
        <div className="mt-3 md:mt-0">
          <label
            htmlFor="todo_date"
            className="block text-sm text-gray-500 dark:text-gray-300"
          >
            Select a date
          </label>

          <input
            type="date"
            placeholder="TODO's date"
            name="todo_date"
            onChange={handleDateChange}
            onReset={handleDateReset}
            className="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          />
        </div>
      </div>
      <div className="max-w mt-4 gap-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <RxLetterCaseCapitalize size={20} color="gray" />
          </div>
          <input
            type="text"
            id="todoContentInput"
            onKeyDown={handleKeyDown}
            ref={contentRef}
            className={`block w-full p-4 pl-10 text-sm text-gray-900 border ${
              todoTitle.title == "" ? "border-red-500" : "border-gray-300"
            } rounded-lg bg-gray-50 ${
              todoTitle.title == ""
                ? "focus:ring-red-500 focus:border-red-500"
                : "focus:ring-blue-500 focus:border-blue-500"
            }  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
            placeholder="Enter the TODO's title..."
            onChange={(event) => {
              setTodoTitle({
                ...todoTitle,
                title: event.currentTarget.value,
              });
            }}
          />
          <button
            type="button"
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handleTodoAdd}
          >
            Add TODO
          </button>
        </div>
        {todoTitle.title == "" && (
          <p className="mt-1.5 font-medium text-red-500">
            Please enter a valid title to add a TODO...
          </p>
        )}
      </div>
      <div className="mt-8 shadow-sm border rounded-lg overflow-x-auto">
        <Table hoverable className="w-full table-auto text-sm text-left">
          <Table.Head>
            <Table.HeadCell>Id</Table.HeadCell>
            <Table.HeadCell>Title</Table.HeadCell>
            <Table.HeadCell>Created by</Table.HeadCell>
            <Table.HeadCell>Created at</Table.HeadCell>
            <Table.HeadCell>Due at</Table.HeadCell>
            <Table.HeadCell>Active</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {todos.map((todo, key) => {
              return (
                <Table.Row
                  key={key}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>{todo.id}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {todo.title.length > 12
                      ? todo.title.substring(0, 12).concat("...")
                      : todo.title}
                  </Table.Cell>
                  <Table.Cell>{todo.created_by}</Table.Cell>
                  <Table.Cell>{todo.created_at}</Table.Cell>
                  <Table.Cell>{todo.due_at}</Table.Cell>
                  <Table.Cell>{todo.active ? "Active" : "Inactive"}</Table.Cell>
                  <Table.Cell>
                    <Dropdown label="Action" color="gray">
                      <Link to={`/todos/update/${todo.id}`}>
                        <Dropdown.Item icon={AiOutlineEdit}>Edit</Dropdown.Item>
                      </Link>
                      <Dropdown.Item
                        icon={AiOutlineDelete}
                        onClick={() => {
                          handleTodoDelete(todo.id);
                        }}
                      >
                        Delete
                      </Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default Todos;
