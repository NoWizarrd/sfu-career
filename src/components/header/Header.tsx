import "./Header.scss";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="header">         
            <Link to={"/"}>  
                <div className="logo">
                    <img src={logo} alt="logo" />
                    <div>SFU-Карьера</div>
                </div>
            </Link>
            

            <div className="buttons">

                <Link to={"/authorization"}> Регистрация</Link>
                <Link to={"/authorization"}> Вход</Link>
            </div>
        </header>
    );
}
