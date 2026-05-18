import { Outlet } from "react-router-dom";
import CategoryNavbar from "../components/CategoryNavbar";

function Layout() {
  return (
    <>
      <CategoryNavbar />
      <Outlet />
    </>
  );
}

export default Layout;