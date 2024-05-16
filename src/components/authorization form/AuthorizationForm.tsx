import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AuthorizationForm.module.scss";
import axios from "axios";

export default function AuthorizationForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLoginSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:4444/students/login", { email, password })
            if (response.status === 200) {
                console.log("Успешный вход");
                window.localStorage.setItem('token', response.data.token)
                navigate(`/student/${response.data._id}`)
                location.reload()
            } else {
                console.log("Ошибка входа");
            }
        } catch (error) {
            try{
                const responseCompany = await axios.post("http://localhost:4444/companies/login", { email, password })
            if (responseCompany.status === 200) {
                console.log("Успешный вход");
                window.localStorage.setItem('token', responseCompany.data.token)
                navigate(`/company/${responseCompany.data._id}`)
                location.reload()
            } else {
                console.log("Ошибка входа");
            }
            } catch{
                console.error("Ошибка при отправке данных на сервер:", error);
            }
        }
    };
    return (
        <form className={styles.enterForm} onSubmit={handleLoginSubmit}>
            <p className={styles.header}>Вход</p>
            <input className={styles.input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className={styles.input} name="password1" type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div>
                <button className={styles.submitBtn} type="submit"> Войти </button>
                <Link to={"/registration"}>
                    <p className={styles.backBtn}>Нет аккаунта?</p>
                </Link>
            </div>
        </form>
    );
}
