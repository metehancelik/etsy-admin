import styles from "./footer.module.css";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.text} style={{ marginLeft: "auto" }}>
        © All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
