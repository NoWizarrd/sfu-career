import React, { useEffect } from 'react';
import styles from './ModalNotAuth.module.scss';

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
}

const ModalNotAuth: React.FC<ModalProps> = ({ onClose, children }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={styles.modalContent}>
            {children}
        </div>
    );
};

export default ModalNotAuth;
