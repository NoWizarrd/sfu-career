import { useNavigate } from "react-router-dom";
import RegistrationForm from "../../components/register form/RegistrationForm";
import styles from "./RegistrationPage.module.scss";
import { useEffect } from "react";
import checkAuth from "../../scripts/checkAuth";

export default function RegistrationPage() {
  const navigate = useNavigate();

  useEffect(() => {
      if (checkAuth()) {
          navigate('/');
      }
  }, [navigate]);
  return (
    <div className={styles.main}>
      <div className={styles.block}>
        <RegistrationForm/>
      </div>
    </div>
  )
}
