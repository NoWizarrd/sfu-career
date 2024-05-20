import React from 'react';
import styles from './DeleteVacancyModal.module.scss';

interface DeleteVacancyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    vacancyTitle: string;
}

const DeleteVacancyModal: React.FC<DeleteVacancyModalProps> = ({ isOpen, onClose, onConfirm, vacancyTitle }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Подтверждение удаления</h2>
                <p>Вы точно хотите удалить вакансию <strong>{vacancyTitle}</strong>?</p>
                <div className={styles.buttons}>
                    <button onClick={onConfirm} className={styles.saveButton}>Подтвердить</button>
                    <button onClick={onClose} className={styles.cancelButton}>Отмена</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteVacancyModal;
