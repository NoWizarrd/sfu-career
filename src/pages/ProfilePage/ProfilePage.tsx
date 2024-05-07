import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom"; 
import styles from "./ProfilePage.module.scss";
import noAvatar from "../../assets/noAvatar.jpg"

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
  const {
    data: studentData,
    isError,
    isLoading,
  } = useQuery<StudentData>(["student", profileId], () => getStudent(profileId!));

  if (isLoading) return(
    <div className={styles.pageContainer}>
        <div>Loading...</div>
    </div>
  )
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
                <button className={styles.practicesButton}>Пройденные практики</button>
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
            <button className={styles.editButton}>Изменить данные</button>
        </div>
        </div>
    </div>
  );
};

export default StudentProfile;
