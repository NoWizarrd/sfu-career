import styles from "./Header.module.scss";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className={styles.header}>         
            <Link to={"/"}>  
                <div className={styles.logo}>
                    <img src={logo} alt="logo" />
                    <div>SFU-Карьера</div>
                </div>
            </Link>
            

            <div className={styles.buttons}>

                <Link to={"/registration"}> Регистрация</Link>
                <Link to={"/login"}> Вход</Link>
            </div>
        </header>
    );
}
