import React, { useEffect } from 'react';
import styles from './ModalMessage.module.scss';

interface ModalProps {
    onClose: () => void;
    message: string;
}

const ModalMessage: React.FC<ModalProps> = ({ onClose, message }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                {message}
            </div>
        </div>
    );
};

export default ModalMessage;
