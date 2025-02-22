import React from "react";
import { Outlet } from "react-router-dom";
import {Header} from "./components/customComponents/index";
function Layout() {
  return (
    <section className="h-screen max-w-5xl mx-auto">
      <Header />
      <Outlet />
    </section>
  );
}

export default Layout;
