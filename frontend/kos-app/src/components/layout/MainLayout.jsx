import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Breadcrumbs from "./Breadcrumbs";
import styles from "./MainLayout.module.css";

const MainLayout = () => {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.mainContainer}>
        <Sidebar />
        <div className={styles.contentArea}>
          <Breadcrumbs />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;