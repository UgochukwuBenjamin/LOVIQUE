
import { Outlet } from "react-router-dom";
import DashboardNavbar from "./DashboardNavbar";

export default function MainLayout() {
  return (
    <>
      <DashboardNavbar />
      <Outlet />
    </>
  );
}
