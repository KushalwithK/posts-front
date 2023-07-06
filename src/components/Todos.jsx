import React, { useEffect, useState } from "react";
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

  const [todoContent, setTodoContent] = useState({
    todoContent: null,
  });

  const [todos, setTodos] = useState([]);

  const handleTodoDelete = (id) => {
    console.log(id);
  };

  useEffect(() => {
    API_SINGLETON.get("/todos").then((response) => {
      console.log(response.data);
      setTodos(response.data);
    });
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
            onChange={(event) => {
              console.log(event.currentTarget.value);
              setTodoDate({ todoDate: event.currentTarget.value });
            }}
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
            type="search"
            id="search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter the TODO's Content..."
            required
          />
          <button
            type="button"
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add TODO
          </button>
        </div>
      </div>
      <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
        <Table hoverable className="w-full table-auto text-sm text-left">
          <Table.Head>
            <Table.HeadCell>TODO Id</Table.HeadCell>
            <Table.HeadCell>Content</Table.HeadCell>
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
                    {todo.content.length > 12
                      ? todo.content.substring(0, 12).concat("...")
                      : todo.content}
                  </Table.Cell>
                  <Table.Cell>{todo.created_by}</Table.Cell>
                  <Table.Cell>{todo.created_at}</Table.Cell>
                  <Table.Cell>{todo.due_at}</Table.Cell>
                  <Table.Cell>{todo.active ? "Active" : "Inactive"}</Table.Cell>
                  <Table.Cell>
                    <Dropdown label="Dropdown button" color="gray">
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
