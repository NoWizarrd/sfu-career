import RegistrationForm from "../../components/register form/RegistrationForm";
import styles from "./RegistrationPage.module.scss";

export default function RegistrationPage() {
  return (
    <div className={styles.main}>
      <div className={styles.block}>
        <RegistrationForm/>
      </div>
    </div>
  )
}
