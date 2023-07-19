import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_SINGLETON } from "../extras/Constant";
import { FileInput, Label } from "flowbite-react";
import { AppContext } from "../AppContext";

const UpdateTodo = () => {
  const { user, users } = useContext(AppContext);
  const [todo, setTodo] = useState({});
  const { todoId } = useParams();

  const navigate = useNavigate();

  const getTodoUsingId = (id) => {
    API_SINGLETON.get("/todos/" + id).then((result) => {
      setTodo(result.data);
    });
  };

  const statuses = [
    'PENDING',
    'ACTIVE',
    'COMPLETED'
  ]

  const handleTodoUpdate = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    formData.append('username', localStorage.getItem('username'))
    formData.append('password', localStorage.getItem('password'))
    console.log(formData);
    API_SINGLETON.post("/todos/" + todoId, formData)
      .then((result) => {
        console.log(result.data);
        navigate('/todos/')
      })
      .catch((error) => { });
  };

  useEffect(() => {
    getTodoUsingId(todoId);
  }, []);

  return (
    <div className="w-full flex justify-center items-center">
      <form
        onSubmit={handleTodoUpdate}
      >
        <div className="mt-10 ml-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <p className="font-medium">Update a TODO</p>
        </div>
        <div className="mt-4 ml-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label
              htmlFor="todoTitle"
              class="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
            >
              <span class="text-xs font-medium text-gray-700"> Title </span>

              <input
                type="text"
                id="todoTitle"
                name="title"
                placeholder="Ex. Developer's TODO"
                class="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                defaultValue={todo.title}
                onChange={(event) => {
                  setTodo({ ...todo, title: event.currentTarget.value })
                  console.log(todo);
                }}
              />
            </label>
          </div>
        </div>
        <div className="mt-4 ml-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label
              htmlFor="todoContent"
              class="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
            >
              <span class="text-xs font-medium text-gray-700"> Content </span>

              <textarea
                type="text"
                name="content"
                rows={4}
                onChange={(event) => {
                  setTodo({ ...todo, content: event.currentTarget.value })
                  console.log(todo);
                }}
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
              htmlFor="createdBy"
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
              htmlFor="createdFor"
              class="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
            >
              <span class="text-xs font-medium text-gray-700">
                {" "}
                Created For{" "}
              </span>

              <select
                id="created"
                name="created_for"
                onChange={(event) => {
                  setTodo({ ...todo, created_for: event.currentTarget.value })
                  console.log(todo);
                }}
                defaultValue={todo.created_for}
                class="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm disabled"

              >
                {
                  users.map((user) => {
                    return <option value={user.username}>{user.first_name + " " + user.last_name}</option>
                  })
                }

              </select>
            </label>
          </div>
        </div>
        <div className="mt-5 ml-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-2 disabled">
            <label
              htmlFor="status"
              class="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
            >
              <span class="text-xs font-medium text-gray-700">
                {" "}
                Status{" "}
              </span>

              <select
                id="status"
                name="status"
                onChange={(event) => {
                  setTodo({ ...todo, status: event.currentTarget.value })
                  console.log(todo);
                }}
                defaultValue={todo.status}
                class="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"

              >
                {
                  statuses.map((status) => {
                    return <option value={status}>{status}</option>
                  })
                }
              </select>
            </label>
          </div>

        </div>
        {
          user?.is_superuser &&
          <div className="mt-5 ml-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="dueAt"
                class="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span class="text-xs font-medium text-gray-700"> Due at </span>

                <input
                  type="date"
                  id="dueAt"
                  name="due_at"
                  placeholder="Ex. 23-09-2002"
                  onChange={(event) => {
                    setTodo({ ...todo, due_at: event.currentTarget.value })
                    console.log(todo);
                  }}
                  class="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  defaultValue={todo.due_at}
                />
              </label>
            </div>
          </div>
        }
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
