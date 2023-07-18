import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_SINGLETON } from "../extras/Constant";
import { FileInput, Label } from "flowbite-react";
import { AppContext } from "../AppContext";

const UpdateTodo = () => {
  const { user, users } = useContext(AppContext);
  const [todo, setTodo] = useState({});
  const [updatedData, setUpdatedData] = useState({});
  const { todoId } = useParams();

  const navigate = useNavigate();

  const getTodoUsingId = (id) => {
    API_SINGLETON.get("/todos/" + id).then((result) => {
      setTodo(result.data);
    });
  };

  const handleTodoUpdate = (id) => {
    API_SINGLETON.post("/todos/update/" + id)
      .then((result) => { })
      .catch((error) => { });
  };

  useEffect(() => {
    getTodoUsingId(todoId);
  }, []);

  return (
    <div className="w-full flex justify-center items-center">
      <form
        method="POST"
      // encType="application/x-www-form-urlencoded"
      // onSubmit={handleUpdatePost}
      >
        <div className="mt-10 ml-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <p className="font-medium">Update a TODO</p>
        </div>
        <div className="mt-4 ml-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label
              for="todoTitle"
              class="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
            >
              <span class="text-xs font-medium text-gray-700"> Title </span>

              <input
                type="text"
                id="todoTitle"
                placeholder="Ex. Developer's TODO"
                class="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                defaultValue={todo.title}
                onChange={(event) => {
                  console.log(event.currentTarget.value);
                  setTodo({ ...todo, title: event.currentTarget.value })
                }}
              />
            </label>
          </div>
        </div>
        <div className="mt-4 ml-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label
              for="todoContent"
              class="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
            >
              <span class="text-xs font-medium text-gray-700"> Content </span>

              <input
                type="text"
                id="todoContent"
                placeholder="Ex. Very imp task"
                class="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                defaultValue={todo.content}
              />
            </label>
          </div>
        </div>
        <div className="mt-5 ml-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-2 disabled">
            <label
              for="createdBy"
              class="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
            >
              <span class="text-xs font-medium text-gray-700">
                {" "}
                Created By{" "}
              </span>

              <input
                type="text"
                id="createdBy"
                placeholder="Ex. John Smith"
                defaultValue={todo.created_by}
                class="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                readOnly
              />
            </label>
          </div>
          <div className="sm:col-span-2 disabled">
            <label
              for="createdFor"
              class="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
            >
              <span class="text-xs font-medium text-gray-700">
                {" "}
                Created For{" "}
              </span>

              <select
                id="created"
                class="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm disabled"
                readOnly
              >
                {
                  users.map((user) => {
                    return <option selected={todo.created_for == user.username} value={user.username}>{user.first_name + " " + user.last_name}</option>
                  })
                }

              </select>
            </label>
          </div>
        </div>
        <div className="mt-5 ml-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-2">
            <label
              for="createdAt"
              class="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
            >
              <span class="text-xs font-medium text-gray-700">
                {" "}
                Created At{" "}
              </span>

              <input
                type="text"
                id="createdAt"
                placeholder="Ex. 20-09-2002"
                defaultValue={todo.created_at}
                readOnly
                class="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
              />
            </label>
          </div>
          <div className="sm:col-span-2">
            <label
              for="dueAt"
              class="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
            >
              <span class="text-xs font-medium text-gray-700"> Due at </span>

              <input
                type="date"
                id="dueAt"
                placeholder="Ex. 23-09-2002"
                class="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                defaultValue={todo.due_at}
              />
            </label>
          </div>
        </div>
        <div className="mt-5 ml-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <div id="fileUpload">
              <div className="mb-2 block">
                <Label htmlFor="file" value="Upload file" disabled />
              </div>
              <FileInput
                disabled
                helperText="Note: Only upload a file if your would like to replace the current file"
                id="file"
              />
            </div>
          </div>
        </div>
        <div className="mt-5 ml-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-6">
          <button
            type="reset"
            className="sm:col-span-2 rounded-lg bg-transparent px-6 py-3 text-sm font-medium text-indigo-600 border-solid border-2 border-indigo-600 shadow-sm hover:bg-indigo-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Revert Form
          </button>
          <button
            type="submit"
            className="sm:col-span-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Update TODO
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTodo;
