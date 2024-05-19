import React, { useState } from 'react';
import styles from './ChangePasswordModal.module.scss';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newPassword: string) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, onSave }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSave = () => {
        if (newPassword.length < 5) {
            setErrorMessage('Пароль должен быть не менее 5 символов.');
        } else if (newPassword !== confirmPassword) {
            setErrorMessage('Пароли не совпадают.');
        } else {
            onSave(newPassword);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Смена пароля</h2>
                <div>
                    <label>Введите новый пароль</label>
                    <input 
                        type="password"
                        name='password1' 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        autoComplete="new-password"
                    />
                </div>
                <div>
                    <label>Повторите пароль</label>
                    <input 
                        type="password" 
                        name='password2' 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        autoComplete="new-password"
                    />
                </div>
                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                <div className={styles.buttons}>
                    <button onClick={handleSave} className={styles.saveButton}>Сохранить</button>
                    <button onClick={onClose} className={styles.cancelButton}>Отмена</button>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
