import AuthorizationForm from "../../components/authorization form/AuthorizationForm";
import styles from "./RegistrationPage.module.scss";

export default function RegistrationPage() {
  return (
    <div className={styles.main}>
      <div className={styles.block}>
        <AuthorizationForm type={"register"}/>
      </div>
    </div>
  )
}
