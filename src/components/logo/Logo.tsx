import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import styles from "./Logo.module.scss";
import checkAuth from "../../scripts/checkAuth";
import { useState } from "react";


export default function Logo(){
    const [isAuth, setIsAuth] = useState(checkAuth())
    
        return (
            <Link onClick={()=>setIsAuth(checkAuth)} to={isAuth ? "/search" : "/"} className={styles.logo}>
                <img src={logo} alt="logo" />
                <div>SFU-Карьера</div>
            </Link>
        );
    }