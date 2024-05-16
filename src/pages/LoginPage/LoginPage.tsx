import { useNavigate } from "react-router-dom";
import AuthorizationForm from "../../components/authorization form/AuthorizationForm";
import styles from "./LoginPage.module.scss";
import checkAuth from "../../scripts/checkAuth";
import { useEffect } from "react";

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
      if (checkAuth()) {
          navigate('/');
      }
  }, [navigate]);
  return (
    <div className={styles.main}>
      <div className={styles.block}>
        <AuthorizationForm/>
      </div>
    </div>
  )
}
