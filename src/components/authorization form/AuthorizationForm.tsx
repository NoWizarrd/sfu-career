import { Link } from "react-router-dom";
import styles from "./AuthorizationForm.module.scss";

// const submitClick = (event: MouseEvent) =>{
//     event.preventDefault()
// }
export default function AuthorizationForm({ type }: { type: string }) {
    if (type === "login") {
        return (
            <form className={styles.enterForm}>
                <p className={styles.header}>Вход</p>
                <input className={styles.input} type="email" placeholder="Email"/>
                <input className={styles.input} name="password1" type="password" placeholder="Пароль"/>
                <div>
                    <button className={styles.submitBtn} type="submit"> Войти </button>
                    <Link to={"/registration"}>
                        <p className={styles.backBtn}>Нет аккаунта?</p>
                    </Link>
                </div>
            </form>
        );
    } else if (type === "register") {
        return(
            <form className={styles.enterForm}>
            <p className={styles.header}>Регистрация</p>
            <input className={styles.input} type="email" placeholder="Email"/>
            <input className={styles.input} name="password1" type="password" placeholder="Пароль"/>
            <input className={styles.input} name="password2" type="password" placeholder="Подтвердить пароль"/>
            <div>
                <button className={styles.submitBtn} type="submit">Зарегистрироваться</button>
                <Link to={"/login"}>
                    <p className={styles.backBtn}>Есть аккаунт?</p>
                </Link>
            </div>
        </form>
        )
    }
}
