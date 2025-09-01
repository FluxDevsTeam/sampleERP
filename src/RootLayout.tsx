import React from "react";
import ScrollToTop from "./components/ScrollToTop";
import { Outlet } from "react-router-dom";

const RootLayout: React.FC = () => (
  <>
    <ScrollToTop />
    <Outlet />
  </>
);

export default RootLayout;
