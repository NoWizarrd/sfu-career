import styles from "./Header.module.scss";
import Logo from "../logo/Logo";
import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import checkAuth from "../../scripts/checkAuth";

interface JWT {
    _id: string;
    user: "student" | "company";
}

export default function Header() {
    const location = useLocation();
    const token = localStorage.getItem("token");
    const [isAuth, setIsAuth] = useState(checkAuth());

    useEffect(() => {
        const authStatus = checkAuth();
        if (!authStatus) {
            setIsAuth(false);
        }
    }, [token]);

    let myProfile: JWT | undefined;
    if (token) {
        const { _id, user } = jwtDecode<JWT>(token);
        myProfile = { _id, user };
    }

    const handleLogoClick = () => {
        setIsAuth(checkAuth());
    };

    const isProfileActive = location.pathname === `/${myProfile?.user}/${myProfile?._id}`;
    const isOtherStudentProfile = location.pathname.startsWith('/student/') && !isProfileActive;
    const isOtherCompanyProfile = location.pathname.startsWith('/company/') && !isProfileActive;
    const isStudentSearchActive = location.pathname.startsWith('/search/student');
    const isVacancySearchActive = location.pathname.startsWith('/search/vacancy');

    return (
        <header className={isAuth ? styles.headerAuth : styles.header}>
            <Logo onLogoClick={handleLogoClick} />
            <div className={styles.navWrapper}>
                <nav className={styles.navMenu}>
                    <Link to="/search/student" className={`${styles.navButton} ${isStudentSearchActive ? styles.active : ''}`}>
                        Студенты
                    </Link>
                    <Link to="/search/vacancy" className={`${styles.navButton} ${isVacancySearchActive ? styles.active : ''}`}>
                        Вакансии
                    </Link>
                </nav>
                <nav className={`${styles.navSection}`}>
                    {!isAuth ? (
                        <div className={`${styles.navSection} ${styles.right}`}>
                            <Link to="/registration" className={`${styles.navButton} ${location.pathname === '/registration' ? styles.active : ''}`}>
                                Регистрация
                            </Link>
                            <Link to="/login" className={`${styles.navButton} ${location.pathname === '/login' ? styles.active : ''}`}>
                                Вход
                            </Link>
                        </div>
                    ) : (
                        <div className={`${styles.navSection} ${styles.right2}`}>
                            <Link to={myProfile ? `/${myProfile.user}/${myProfile._id}` : "/"} className={`${styles.navButton} ${isProfileActive ? styles.active : ''} ${isProfileActive ? styles.myProfile : ''} ${isOtherStudentProfile ? styles.studentProfile : ''} ${isOtherCompanyProfile ? styles.companyProfile : ''}`}>
                                Профиль
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
