import { useEffect, useState } from "react";
import { POST_ENDPOINT, API_SINGLETON } from "../../extras/Constant";
import {
  POST_ROUTE,
  CREATE_POST_ROUTE,
  UPDATE_POST_ROUTE,
} from "../../extras/Routes";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../AppContext";

// NavLink component
const NavLink = ({ ...props }) => {
  const { children, href = "", className = "", active = "" } = props;

  const [pathname, setPathname] = useState("/");

  const isActive = pathname == href;
  const activeClass = isActive ? active : "";

  useEffect(() => {
    setPathname(window.location.pathname);
  }, [props]);

  return (
    <Link to={href} className={`${activeClass} ${className}`}>
      {children}
    </Link>
  );
};

// Title component
const Title = ({ children }) => (
  <h3 className="pb-3 px-4 font-medium text-gray-800 md:px-8">{children}</h3>
);

// Sections List
const SectionsList = ({ items }) => {
  // if (items.accessibleBy === "Admin") {
  //   console.log(activeUser.is_superuser);
  //   // if (!activeUser.is_superuser) {
  //   //   return <div>CANNOT ACCESS THIS</div>;
  //   // }
  // }
  return (
    <div className="text-gray-600 px-4 md:px-8">
      <ul>
        {items?.map((item, idx) => (
          <li key={idx}>
            <NavLink
              href={item?.href}
              active="text-gray-900 border-indigo-600"
              className="block w-full py-2 px-4 border-l hover:border-indigo-600 hover:text-gray-900 duration-150"
            >
              {item?.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();

  const { setIsAuthenticated } = useContext(AppContext);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");

    setIsAuthenticated(false);
    navigate("/login");
  };

  const lessons = {
    postsSection: [
      { name: "See all Posts", href: "/form", accessibleBy: "Staff" },
      { name: "Create Post", href: "/posts/create", accessibleBy: "Staff" },
    ],
    todoListSection: [
      { name: "See all TODO's", href: "/todos/", accessibleBy: "Admin" },
      { name: "My TODO's", href: "/todos/my", accessibleBy: "Admin" },
    ],
  };

  return (
    <>
      <div className="z-40 top-0 left-0 w-full h-full border-r bg-white space-y-8 overflow-auto sm:w-80">
        <div className="sticky top-0 space-y-8 bg-white">
          <div className="h-20 flex items-center px-4 border-b md:px-8">
            <a href="" className="flex-none">
              <h1 className="center">Sidebar Panels</h1>
            </a>
          </div>
        </div>
        <div className="text-[0.9rem] space-y-6">
          <>
            <div>
              <Title>Posts</Title>
              <SectionsList items={lessons.postsSection} />
            </div>
            <div>
              <Title>Posts</Title>
              <SectionsList items={lessons.todoListSection} />
            </div>
            <div>
              <Title>Utils</Title>
              <div className="text-gray-600 px-4 md:px-8">
                <ul>
                  <li
                    onClick={handleLogout}
                    active="text-gray-900 border-indigo-600"
                    className="block w-full py-2 px-4 border-l hover:border-indigo-600 hover:text-gray-900 duration-150 cursor-pointer"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
