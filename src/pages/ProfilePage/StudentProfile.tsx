import React, { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom"; 
import styles from "./ProfilePage.module.scss";
import noAvatar from "../../assets/noAvatar.jpg";
import {jwtDecode} from 'jwt-decode';
import Loader from "../../components/loader/Loader";
import ModalNotAuth from "../../components/modals/ModalNotAuth";

interface StudentData {
    _id: string;
    surname: string;
    name: string;
    patronymic: string;
    institute: string;
    specialty: string;
    course: number;
    practices: string;
    avatarUrl: string;
    personalSkills: string[];
    about: string;
}

interface JWT {
    _id: string,
    user: 'student' | 'company',
    exp: number,
    iat: number  
}

const getStudent = async (id: string): Promise<StudentData> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`http://localhost:4444/students/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
}

const StudentProfile: React.FC = () => {
    const { profileId } = useParams();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        data: studentData,
        isError,
        isLoading,
    } = useQuery<StudentData>(["student", profileId], () => getStudent(profileId!));

    const token = localStorage.getItem('token');
    let myId: string | undefined
    if (token) {
        const { _id } = jwtDecode<JWT>(token)
        myId = _id
    }
    function exitFromProfile() {
        window.localStorage.removeItem('token')
        navigate('/login');
        location.reload()
    }

    function handleUnauthorizedAction() {
        setIsModalOpen(true);
    }

    if (isLoading) return(<Loader/>)
    if (isError || !studentData) return(
        <div className={styles.pageContainer}>
            <div>Error loading the student data.</div>
        </div>
    )

    return (
        <div className={styles.pageContainer}>
            <div className={styles.studentProfile}>
                <div className={styles.profileHeader}>
                    <img
                        src={studentData.avatarUrl ? studentData.avatarUrl : noAvatar}
                        alt="avatar"
                        className={styles.profilePhoto}
                    />
                    <div className={styles.profileInfo}>
                        <div className={styles.profileDetailsSection}>
                            <p><strong>ФИО:</strong> {studentData.surname} {studentData.name} {studentData.patronymic}</p>
                            <p><strong>Институт:</strong> {studentData.institute}</p>
                            <p><strong>Специальность:</strong> {studentData.specialty}</p>
                            <p><strong>Курс:</strong> {studentData.course}</p>
                            <button
                                className={styles.practicesButton}
                                onClick={token ? () => { /* логика для авторизованных пользователей */ } : handleUnauthorizedAction}
                            >
                                Пройденные практики
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles.profileDetails}>
                    <div className={styles.profileDetailsSection}>
                        <h2>Профессиональные навыки</h2>
                        <p>{studentData.personalSkills.join(', ')}</p>
                    </div>
                    <div className={styles.profileDetailsSection}>
                        <h2>О себе</h2>
                        <p>{studentData.about}</p>
                    </div>
                    {profileId === myId 
                        ? (
                            <>
                                <button className={styles.editButton}>Изменить данные</button>
                                <button className={styles.exitButton} onClick={exitFromProfile}>Выйти из аккаунта</button>
                            </>
                        ) : (
                            <button
                                className={styles.messageButton}
                                onClick={token ? () => { /* логика для авторизованных пользователей */ } : handleUnauthorizedAction}
                            >
                                Отправить сообщение
                            </button>
                        )
                    }
                </div>
            </div>
            {isModalOpen && (
                <ModalNotAuth onClose={() => setIsModalOpen(false)}>
                    <p>Для выполнения этого действия необходимо авторизоваться</p>
                </ModalNotAuth>
            )}
        </div>
    );
};

export default StudentProfile;
