import AuthorizationForm from "../../components/authorization form/AuthorizationForm";
import styles from "./LoginPage.module.scss";

export default function LoginPage() {
  return (
    <div className={styles.main}>
      <div className={styles.block}>
        <AuthorizationForm/>
      </div>
    </div>
  )
}
