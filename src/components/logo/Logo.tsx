import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import styles from "./Logo.module.scss";


export default function Logo(){
    const token = localStorage.getItem('token');
    if (token){
        return(
            <Link to={"/search"} className={styles.logo}>  
                <img src={logo} alt="logo" />
                <div>SFU-Карьера</div>
            </Link>
        )
    } else {
        return(
            <Link to={"/"} className={styles.logo}>  
                <img src={logo} alt="logo" />
                <div>SFU-Карьера</div>
            </Link>
        )
    }

}