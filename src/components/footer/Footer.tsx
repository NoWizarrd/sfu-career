import "./Footer.scss";
import vk from '../../assets/vk.png'
import telegram from '../../assets/telegram.png'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="sfu">
                <div>Сайт Сибирского федерального университета</div>
                <div>Система электронного обучения СФУ</div>
            </div>
            <div className="contacts">
                <div>Контакты разработчика</div>
                <img src={vk} alt="vk" />
                <img src={telegram} alt="telegram" />
            </div>
        </footer>
    );
}
