import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Breadcrumbs from "./Breadcrumbs";
import styles from "./MainLayout.module.css";

const MainLayout = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.mainContainer}>
        <Sidebar />
        <div className={styles.contentArea}>
          <Breadcrumbs />
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
