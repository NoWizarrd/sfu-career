import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./RegistrationForm.module.scss";
import axios from "axios";

export default function RegistrationForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [course, setCourse] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [institute, setInstitute] = useState("");
    const [patronymic, setPatronymic] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const navigate = useNavigate();

const handleRegisterSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
        const response = await axios.post("http://localhost:4444/students/register", {
            email,
            password,
            course,
            specialty,
            institute,
            patronymic,
            name,
            surname
        });
        if (response.status === 200) {
            console.log("Успешная регистрация");
            navigate("/profile");
        } else {
            console.log("Ошибка регистрации");
        }
    } catch (error) {
        console.error("Ошибка при отправке данных на сервер: ", error);
    }
};
return (
    <form className={styles.enterForm} onSubmit={handleRegisterSubmit}>
        <p className={styles.header}>Регистрация</p>
        <input className={styles.input} type="text" placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} />
        <input className={styles.input} type="text" placeholder="Фамилия" value={surname} onChange={(e) => setSurname(e.target.value)} />
        <input className={styles.input} type="text" placeholder="Отчество" value={patronymic} onChange={(e) => setPatronymic(e.target.value)} />
        <input className={styles.input} type="text" placeholder="Курс" value={course} onChange={(e) => setCourse(e.target.value)} />
        <input className={styles.input} type="text" placeholder="Специальность" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
        <input className={styles.input} type="text" placeholder="Институт" value={institute} onChange={(e) => setInstitute(e.target.value)} />
        <input className={styles.input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={styles.input} name="password1" type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input className={styles.input} name="password2" type="password" placeholder="Подтвердить пароль" />
        <div>
            <button className={styles.submitBtn} type="submit">Зарегистрироваться</button>
            <Link to={"/login"}>
                <p className={styles.backBtn}>Есть аккаунт?</p>
            </Link>
        </div>
    </form>
);
}
