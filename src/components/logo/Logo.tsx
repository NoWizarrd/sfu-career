import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import styles from "./Logo.module.scss";
import checkAuth from "../../scripts/checkAuth";

interface LogoProps {
    onLogoClick: () => void;
}

export default function Logo({ onLogoClick }: LogoProps){
    const navigate = useNavigate();

    const handleClick = () => {
        const authStatus = checkAuth();
        if (authStatus) {
            if (authStatus === 'student') {
                navigate('/search/vacancy');
            } else if (authStatus === 'company') {
                navigate('/search/student');
            }
        } else {
            navigate('/');
        }
        onLogoClick();
    }

    return (
        <div onClick={handleClick} className={styles.logo}>
            <img src={logo} alt="logo" className={styles.logoImage} />
            <div className={styles.logoText}>SFU-Карьера</div>
        </div>
    );
}
