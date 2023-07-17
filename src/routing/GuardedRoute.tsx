import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import SidebarItem from "../components/subComponents/SidebarItem";

interface GuardedRouteProps {
  isRouteAccessible?: boolean;
  redirectRoute?: string;
  login?: boolean;
}

const GuardedRoute = ({
  isRouteAccessible = false,
  redirectRoute = "/",
  login = false,
}: GuardedRouteProps): JSX.Element =>
  isRouteAccessible ? (
    <>
      {!login && <SidebarItem />}
      <Outlet />
    </>
  ) : (
    <Navigate to={redirectRoute} replace />
  );

export default GuardedRoute;
