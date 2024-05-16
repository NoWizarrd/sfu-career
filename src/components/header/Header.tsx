import styles from "./Header.module.scss";
import Logo from "../logo/Logo";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import checkAuth from "../../scripts/checkAuth";

interface JWT {
    _id: string;
    user: "student" | "company";
}

export default function Header() {
    const token = localStorage.getItem("token");
    const [isAuth, setIsAuth] = useState(checkAuth());

    const handleLogoClick = () => {
        setIsAuth(checkAuth());
    };
    let myProfile: JWT | undefined;
    if (token) {
        const { _id, user } = jwtDecode<JWT>(token);
        myProfile = { _id, user };
    }
    return (
        <header className={isAuth ? styles.headerAuth : styles.header}>
            <Logo onLogoClick={handleLogoClick}/>
            {!isAuth ? (
                <>
                    <Link to={"/search/student"} className={styles.buttonStudent}>
                        Студенты
                    </Link>
                    <Link to={"/search/vacancy"} className={styles.buttonVacancy}>
                        Вакансии
                    </Link>
                    <Link to={"/registration"} className={styles.button1Auth}>
                        Регистрация
                    </Link>
                    <Link to={"/login"} className={styles.button2}>
                        Вход
                    </Link>
                </>
            ) : (
                <>
                    <Link to={"/search/student"} className={styles.buttonStudent}>
                        Студенты
                    </Link>
                    <Link to={"/search/vacancy"} className={styles.buttonVacancy}>
                        Вакансии
                    </Link>
                    <Link to={myProfile ? `/${myProfile?.user}/${myProfile?._id}` : "/"}
                        className={styles.button2}
                    >
                        Профиль
                    </Link>
                </>
            )}
        </header>
    );
}
