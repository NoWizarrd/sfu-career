import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import styles from "./Logo.module.scss";
import checkAuth from "../../scripts/checkAuth";

export default function Logo(){
    //const [isAuth, setIsAuth] = useState(checkAuth())
        return (
            <Link onClick={()=>{
                localStorage.getItem('token') && !checkAuth() ? location.replace("/") : null
                }} to={"/"} className={styles.logo}>
                <img src={logo} alt="logo" />
                <div>SFU-Карьера</div>
            </Link>
        );
    }