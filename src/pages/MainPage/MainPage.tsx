import { Link } from "react-router-dom";
import styles from "./MainPage.module.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import checkAuth from "../../scripts/checkAuth";
import Loader from "../../components/loader/Loader";


export default function MainPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const authStatus = checkAuth();
        if (authStatus) {
            if (authStatus === 'student') {
                navigate('/search/vacancy');
            } else if (authStatus === 'company') {
                navigate('/search/student');
            }
        } else {
            setLoading(false); 
        }
    }, [navigate]);

    if (loading) {
        return <Loader/>;
    }

    return (
        <div className={styles.main}>
            <h1>
                Приветствуем вас на SFUКарьера – инновационной онлайн-платформе,
                посвященной объединению студенческих талантов и предприятий,
                ищущих перспективных специалистов.
            </h1>
            <div className={styles.blocks}>
                <div className={styles.info}>
                    <h2>🌐 Компаниям</h2>
                    <p>
                        Находите таланты, соответствующие вашим потребностям.
                        SFUКарьера предоставляет удобный доступ к портфолио
                        студентов, их опыту и профессиональным целям.
                    </p>
                </div>
                <div className={styles.info}>
                    <h2>🎓 Студентам</h2>
                    <p>
                        Отмечайте свои достижения, предоставляйте информацию о
                        своих навыках и профессиональном росте. SFUКарьера
                        создан для того, чтобы вы смогли выделиться среди коллег
                        и привлечь внимание потенциальных работодателей.
                    </p>
                </div>
                <div className={styles.info}>
                    <h2>🤝 Удобство</h2>
                    <p>
                        Мы стремимся к созданию простого взаимодействия между
                        студентами и компаниями. SFUКарьера обеспечивает прямую
                        связь, а также обмен информацией без лишних сложностей.
                    </p>
                </div>
            </div>
            <Link to={"/login"}>
                <button className={styles.enterBtn}>Авторизироваться</button>
            </Link>
        </div>
    );
}
