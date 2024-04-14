import styles from "./Header.module.scss";
import Logo from "../logo/Logo";
import { Link } from "react-router-dom";

export default function Header() {
    const isAuth = true;
    const isStudent = false;

    return (
        <header className={isAuth ? styles.headerAuth : styles.header}>
            <Logo />
            {!isAuth ? (
                <div className={styles.notAuth}>
                    <Link to={"/registration"} className={styles.button1}>
                        Регистрация
                    </Link>
                    <Link to={"/login"} className={styles.button2}>
                       Вход
                    </Link>
                </div>
            ) : (
                <>
                    {isStudent ? (
                        <>
                            <Link to={"/search"} className={styles.button1}>
                                Вакансии
                            </Link>

                            <Link to={"/profile"} className={styles.button2}>Профиль</Link>
                        </>
                    ) : (
                        <>
                            <Link to={"/search"} className={styles.button1}>Студенты</Link>
                            <Link to={"/profile"} className={styles.button2}>Профиль</Link>
                        </>
                    )}
                </>
            )}
        </header>
    );
}
