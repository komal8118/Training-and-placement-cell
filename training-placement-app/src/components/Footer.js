import React from "react";
import styles from "./Footer.module.css"; // Import CSS module

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>
        All Rights Reserved | Copyright &copy; {new Date().getFullYear()} - Training and Placement Cell
      </p>
    </footer>
  );
};

export default Footer;
