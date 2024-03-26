import "./Footer.scss";
import vk from '../../assets/vk.png'
import telegram from '../../assets/telegram.png'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="sfu">
                <a href="https://www.sfu-kras.ru/" target="_blank">Сайт Сибирского федерального университета</a>
                <a href="https://e.sfu-kras.ru/" target="_blank">Система электронного обучения СФУ</a>
            </div>
            <div className="contacts">
                <div>Контакты разработчика</div>
                <img src={vk} alt="vk" />
                <img src={telegram} alt="telegram" />
            </div>
        </footer>
    );
}
