import React, { useState } from "react";
import styles from "./ModalChat.module.scss";

interface MessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (message: string) => void;
}

const ModalChat: React.FC<MessageModalProps> = ({ isOpen, onClose, onSend }) => {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (message.trim() !== "") {
            onSend(message);
            setMessage("");
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Отправить сообщение</h2>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Введите сообщение..."
                    className={styles.textarea}
                />
                <div className={styles.buttons}>
                    <button onClick={handleSend} className={styles.sendButton}>Отправить</button>
                    <button onClick={onClose} className={styles.cancelButton}>Отмена</button>
                </div>
            </div>
        </div>
    );
};

export default ModalChat;
