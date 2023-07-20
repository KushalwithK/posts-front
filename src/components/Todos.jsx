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

const Todos = () => {
  const { user, users } = useContext(AppContext);

  const [date, setDate] = useState("");

  const [selectedUser, setSelectedUser] = useState("All");

  const [page, setPage] = useState(1);

  const tableItems = [
    {
      label: "Assigned",
      title: "Top countries",
    },
    {
      label: "Unassigned",
      title: "Top devices",
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

  const getTodos = (assigned = "All", date = "", page_no = page) => {
    API_SINGLETON.get("/todos", {
      params: {
        username: localStorage.getItem("username"),
        password: localStorage.getItem("password"),
        assigned,
        date,
        page_no: page_no,
      },
    }).then((response) => {
      console.log(response.data);
      const todos = response.data;
      setTodos(todos);
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

  const handleDateReset = () => {
    getTodos();
  };

  const handleTodoAdd = () => {
    if (todoTitle.title == null) setTodoTitle({ ...todoTitle, title: "" });
    else if (todoTitle.title != "") {
      const formData = new FormData();
      formData.append("title", todoTitle.title);
      formData.append("created_by", localStorage.getItem("username"));
      formData.append("created_for", localStorage.getItem("username"));
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

  const handlePaginatePrev = () => {
    if (todos.hasPrevious) {
      getTodos(selectedUser, date, page - 1);
      setPage(page - 1);
    }
  };

  const handlePaginateNext = () => {
    if (todos.hasNext) {
      getTodos(selectedUser, date, page + 1);
      setPage(page + 1);
    }
  };

  const getRemainingDays = (created_at, due_at) => {
    const diff = Math.floor(
      (Date.parse(due_at) - Date.parse(created_at)) / 86400000
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
          <p className="text-gray-600 mt-2">List of all TODO's by You</p>
        </div>
        <div className="mt-3 md:mt-0">
          <div className="items-center justify-between flex gap-4">
            {user?.is_superuser && (
              <div>
                <Dropdown label={selectedUser} color="gray">
                  <Dropdown.Item
                    onClick={() => {
                      setSelectedUser("All");
                      getTodos("All", date);
                    }}
                  >
                    All
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  {users.map((user, key) => {
                    return (
                      <Dropdown.Item
                        key={key}
                        onClick={async () => {
                          setSelectedUser(user.username);
                          getTodos(user.username, date);
                        }}
                      >
                        {user.username}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown>
              </div>
            )}

            <div>
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
                value={date}
                ref={dateRef}
                className="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
              />
            </div>
          </div>
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
                <Table.HeadCell>Created for</Table.HeadCell>
                <Table.HeadCell>Due at</Table.HeadCell>
                <Table.HeadCell>Days remaining</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                {user?.is_superuser && <Table.HeadCell>Actions</Table.HeadCell>}
                <Table.HeadCell>
                  <span className="sr-only">Edit</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {selectedItem == 0
                  ? todos.data
                      .filter((todo) => todo.created_for != null)
                      .map((todo, key) => {
                        return (
                          <Table.Row
                            key={key}
                            className={`${
                              todo.status != "PENDING"
                                ? getRemainingDays(
                                    todo.created_at,
                                    todo.due_at
                                  ) >= 1
                                  ? "bg-green-300"
                                  : "bg-red-300"
                                : "bg-blue-300"
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
                            <Table.Cell>{todo.created_for}</Table.Cell>
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
                            <Table.Cell>{todo.created_for}</Table.Cell>
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
        <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
          <button
            onClick={handlePaginatePrev}
            className="px-4 py-2 border rounded-lg duration-150 hover:bg-gray-50"
          >
            Previous
          </button>
          <div>
            Page {page} of {todos.totalPages}
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

export default Todos;
