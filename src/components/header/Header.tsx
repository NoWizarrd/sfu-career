import styles from "./Header.module.scss";
import Logo from "../logo/Logo";
import { Link } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

interface JWT {
    _id: string,
    user: 'student' | 'company',
}

export default function Header() {
    const isAuth = true; // Это значение должно быть динамическим на основе токена
    const isStudent = false; // Это значение должно определяться на основе роли пользователя

    const token = localStorage.getItem('token');
    let myProfile: JWT | undefined
    if(token){
        const { _id, user} = jwtDecode<JWT>(token)
        myProfile = {_id, user}
    }
    return (
        <header className={isAuth ? styles.headerAuth : styles.header}>
            <Logo />
            {!isAuth ? (
                <>
                    <Link to={"/registration"} className={styles.button1Auth}>
                        Регистрация
                    </Link>
                    <Link to={"/login"} className={styles.button2}>
                        Вход
                    </Link>
                </>
            ) : (
                <>
                    {isStudent ? (
                        <>
                            <Link to={"/search"} className={styles.button1}>
                                Вакансии
                            </Link>
                            <Link to={myProfile ? `/${myProfile?.user}/${myProfile?._id}` : "/"} className={styles.button2}>Профиль</Link>
                        </>
                    ) : (
                        <>
                            <Link to={"/search"} className={styles.button1}>Студенты</Link>
                            <Link to={myProfile ? `/${myProfile?.user}/${myProfile?._id}` : "/"} className={styles.button2}>Профиль</Link>
                        </>
                    )}
                </>
            )}
        </header>
    );
}

