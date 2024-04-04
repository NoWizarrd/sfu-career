import styles from "./Footer.module.scss";
import vk from '../../assets/vk.png'
import telegram from '../../assets/telegram.png'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.sfu}>
                <a href="https://www.sfu-kras.ru/" target="_blank">Сайт Сибирского федерального университета</a>
                <a href="https://e.sfu-kras.ru/" target="_blank">Система электронного обучения СФУ</a>
            </div>
            <div className={styles.contacts}>
                <div>Контакты разработчика</div>
                <img src={vk} alt="vk" />
                <img src={telegram} alt="telegram" />
            </div>
        </footer>
    );
}
