import "./Header.scss";
import logo from "../../assets/logo.png";

export default function Header() {
    return (
        <header className="header">
            <div className="logo">
                <img src={logo} alt="logo" />
                <div>SFU-Карьера</div>
            </div>
            <div className="buttons">
                <div>Регистрация</div>
                <div>Вход</div>
            </div>
        </header>
    );
}
