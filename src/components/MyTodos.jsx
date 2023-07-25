import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Table } from "flowbite-react";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import { API_SINGLETON } from "../extras/Constant";
import { Dropdown } from "flowbite-react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Link } from "react-router-dom";
import { AppContext } from "../AppContext";

const MyTodos = () => {
  const { user, users, decryptPassword } = useContext(AppContext);

  const [date, setDate] = useState("");

  const [selectedUser, setSelectedUser] = useState("All");

  const [pages, setPages] = useState([]);
  const [page, setPage] = useState(1);

  const tableItems = [
    {
      label: "My TODOS",
      title: "",
    },
  ];

  const [selectedItem, setSelectedItem] = useState(0);

  const [todoTitle, setTodoTitle] = useState({
    title: null,
  });

  const contentRef = useRef();
  const dateRef = useRef();

  const [todos, setTodos] = useState({
    data: [],
  });

  const getTodos = (page_no = page) => {
    API_SINGLETON.get("/todos/", {
      params: {
        username: localStorage.getItem("username"),
        password: decryptPassword(localStorage.getItem("password")),
        created_by: true,
        date,
        page_no,
      },
    }).then((response) => {
      console.log(response.data);
      const todos = response.data;
      setTodos(todos);

      for (let i = 1; i <= response.data.totalPages; i++) {
        console.log(i);
        if (i <= 3 || i > response.data.totalPages - 3) {
          pages.push(i);
        }
        if (i == 4) {
          pages.push("...");
        }
      }
      setPages(pages);
      dateRef.current.value = "";
    });
  };

  useEffect(() => {
    getTodos();
  }, []);

  const handleDateChange = (event) => {
    getTodos(selectedUser, event.currentTarget.value);
    setDate(event.currentTarget.value);
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

  const handlePaginatePrev = () => {
    if (todos.hasPrevious) {
      getTodos(selectedUser, date, page - 1);
      setPage(page - 1);
    }
  };

  const handlePaginate = (page) => {
    getTodos(selectedUser, date, page);
    setPage(page);
  };

  const handlePaginateNext = () => {
    if (todos.hasNext) {
      getTodos(selectedUser, date, page + 1);
      setPage(page + 1);
    }
  };

  const getRemainingDays = (created_at, due_at) => {
    const today = new Date().toISOString().split("T")[0];
    const diff = Math.floor(
      (Date.parse(due_at) - Date.parse(today)) / 86400000
    );

    // const DIF_IN_DAYS = dueDate.getDate - created.getDate;

    return Number.isNaN(diff) ? 0 : diff;
  };

  return (
    <div className="w-full pt-10 p-10">
      <div className="items-center justify-between flex">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
            {user?.is_superuser ? "TODO's for ADMIN" : "TODO's for Staff"}
          </h3>
          <p className="text-gray-600 mt-2">
            List of all TODO's created by {user?.username}
          </p>
        </div>
      </div>

      <div className="mt-8 shadow-sm border rounded-lg overflow-x-auto">
        <div className=" mx-auto">
          <div className="text-sm overflow-x-auto">
            <ul
              rol="tablist"
              className="w-full border-b flex items-center gap-x-3 overflow-x-auto"
            >
              {tableItems.map((item, idx) => (
                <li
                  key={idx}
                  className={`py-2 border-b-2 md:px-4 ${
                    selectedItem == idx
                      ? "border-indigo-600 text-indigo-600"
                      : "border-white text-gray-500"
                  }`}
                >
                  <button
                    role="tab"
                    aria-selected={selectedItem == idx ? true : false}
                    aria-controls={`tabpanel-${idx + 1}`}
                    className="py-2.5 px-4 rounded-lg duration-150 hover:text-indigo-600 hover:bg-gray-50 active:bg-gray-100 font-medium"
                    onClick={() => setSelectedItem(idx)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
            <Table hoverable className="w-full table-auto text-sm text-left">
              <Table.Head>
                <Table.HeadCell>Id</Table.HeadCell>
                <Table.HeadCell>Title</Table.HeadCell>
                <Table.HeadCell>Created by</Table.HeadCell>
                <Table.HeadCell>Due at</Table.HeadCell>
                <Table.HeadCell>Days remaining</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only">Edit</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {selectedItem == 0
                  ? todos.data.map((todo, key) => {
                      return (
                        <Table.Row
                          key={key}
                          className={`${
                            todo.status != "PENDING"
                              ? getRemainingDays(
                                  todo.created_at,
                                  todo.due_at
                                ) >= 1
                                ? "bg-green-100"
                                : "bg-red-100"
                              : "bg-blue-100"
                          } dark:border-gray-700 dark:bg-gray-800 ${
                            todo.status != "PENDING"
                              ? getRemainingDays(
                                  todo.created_at,
                                  todo.due_at
                                ) >= 1
                                ? "hover:bg-green-200"
                                : "hover:bg-red-200"
                              : "hover:bg-blue-200"
                          }`}
                        >
                          <Table.Cell>{todo.id}</Table.Cell>
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {todo.title.length > 12
                              ? todo.title.substring(0, 12).concat("...")
                              : todo.title}
                          </Table.Cell>
                          <Table.Cell>{todo.created_by}</Table.Cell>
                          <Table.Cell>
                            {todo.due_at ? todo.due_at : "NOT SET"}
                          </Table.Cell>
                          <Table.Cell>
                            {getRemainingDays(todo.created_at, todo.due_at)}{" "}
                            Days
                          </Table.Cell>
                          <Table.Cell>{todo.status}</Table.Cell>

                          <Table.Cell>
                            <Dropdown label="Action" color="gray">
                              <Link to={`/todos/update/${todo.id}`}>
                                <Dropdown.Item icon={AiOutlineEdit}>
                                  Edit
                                </Dropdown.Item>
                              </Link>
                              {user?.is_superuser && (
                                <Dropdown.Item
                                  icon={AiOutlineDelete}
                                  onClick={() => {
                                    handleTodoDelete(todo.id);
                                  }}
                                >
                                  Delete
                                </Dropdown.Item>
                              )}
                            </Dropdown>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })
                  : todos
                      .filter((todo) => todo.created_for == null)
                      .map((todo, key) => {
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
                            <Table.Cell>
                              {todo.due_at ? todo.due_at : "NOT SET"}
                            </Table.Cell>
                            <Table.Cell>
                              {getRemainingDays(todo.created_at, todo.due_at)}
                            </Table.Cell>
                            <Table.Cell>{todo.status}</Table.Cell>
                            <Table.Cell>
                              <Dropdown label="Action" color="gray">
                                <Link to={`/todos/update/${todo.id}`}>
                                  <Dropdown.Item icon={AiOutlineEdit}>
                                    Edit
                                  </Dropdown.Item>
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
      </div>
      <div className="max-w-screen-xl mx-auto mt-12 px-4 text-gray-600 md:px-8">
        <div
          className="hidden items-center justify-between sm:flex"
          aria-label="Pagination"
        >
          <button
            onClick={handlePaginatePrev}
            className="hover:text-indigo-600 flex items-center gap-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z"
                clipRule="evenodd"
              />
            </svg>
            Previous
          </button>
          <ul className="flex items-center gap-1">
            {pages.map((item, idx) => (
              <li key={item} className="text-sm">
                {item == "..." ? (
                  <div>{item}</div>
                ) : (
                  <button
                    onClick={() => {
                      handlePaginate(item);
                    }}
                    aria-current={page == item ? "page" : false}
                    className={`px-3 py-2 rounded-lg duration-150 hover:text-indigo-600 hover:bg-indigo-50 ${
                      page == item
                        ? "bg-indigo-50 text-indigo-600 font-medium"
                        : ""
                    }`}
                  >
                    {item}
                  </button>
                )}
              </li>
            ))}
          </ul>
          <button
            onClick={handlePaginateNext}
            className="hover:text-indigo-600 flex items-center gap-x-2"
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        {/* On mobile version */}
        <div className="flex items-center justify-between text-sm text-gray-600 font-medium sm:hidden">
          <button
            onClick={handlePaginatePrev}
            className="px-4 py-2 border rounded-lg duration-150 hover:bg-gray-50"
          >
            Previous
          </button>
          <div className="font-medium">
            Page {page} of {pages.length}
          </div>
          <button
            onClick={handlePaginateNext}
            className="px-4 py-2 border rounded-lg duration-150 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyTodos;
