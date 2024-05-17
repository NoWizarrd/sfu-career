import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.scss';

const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.notFoundContainer}>
      <h1>ERROR 404 - Страница не найдена</h1>
      <p>Извините, но страница, которую вы ищете, не существует.</p>
      <Link to="/" className={styles.homeLink}>Вернуться на главную</Link>
    </div>
  );
};

export default NotFoundPage;
