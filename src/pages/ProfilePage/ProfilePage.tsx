import React from 'react';
import styles from './ProfilePage.module.scss'; // Импорт модульных стилей

interface StudentProfile {
    fullName: string;
    institute: string;
    specialty: string;
    course: number;
    additionalInfo: string;
    skills: string[];
    about: string;
}

const mockStudentProfile: StudentProfile = {
    fullName: 'Иванов Иван Иванович',
    institute: 'Название института',
    specialty: 'Название специальности',
    course: 4,
    additionalInfo: 'Дополнительная информация о студенте',
    skills: ['Программирование', 'Дизайн', 'Тестирование'],
    about: 'О себе: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod auctor tortor, vel cursus urna ultrices ac.'
};

const ProfilePage: React.FC = () => {
    const { fullName, institute, specialty, course, additionalInfo, skills, about } = mockStudentProfile;

    return (
        <div className={styles.pageBackground}>
            <div className={styles.root}>
                <div className={styles.profileContainer}>
                    {/* Фото и первый блок контента */}
                    <div className={styles.contentContainer}>
                        <div className={styles.profilePhoto}>
                            <img src="https://sun9-79.userapi.com/impg/I8E355xGE7gnrf2bbEIrhBtE1wuY7n6W3A3jVQ/ND0J64x0BVQ.jpg?size=2560x1707&quality=95&sign=e30b75d421594402aa06c81fab6856dc&type=album" alt="Фотография студента" className={styles.photo} />
                        </div>
                        <div className={styles.profileInfoBlock}>
                            <h2>Профиль студента</h2>
                            <div className={styles.profileDetails}>
                                <div className={styles.profileItem}>
                                    <strong>ФИО:</strong> {fullName}
                                </div>
                                <div className={styles.profileItem}>
                                    <strong>Институт:</strong> {institute}
                                </div>
                                <div className={styles.profileItem}>
                                    <strong>Специальность:</strong> {specialty}
                                </div>
                                <div className={styles.profileItem}>
                                    <strong>Курс:</strong> {course}
                                </div>
                                <div className={styles.profileItem}>
                                    <strong>Доп. информация:</strong> {additionalInfo}
                                </div>
                                <button className={styles.editButton}>Изменить данные</button>
                            </div>
                        </div>
                    </div>

                    {/* Второй блок контента */}
                    <div className={styles.profileSkillsBlock}>
                        <div className={styles.profileSkills}>
                            <h2>Профессиональные навыки</h2>
                            <ul className={styles.skillsList}>
                                {skills.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                            <h2>О себе</h2>
                            <p>{about}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

