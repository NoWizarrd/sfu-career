import React from "react";
import { useQuery } from "react-query";
import styles from "./ProfilePage.module.scss";

interface StudentData {
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

const StudentProfile: React.FC = () => {
  const {
    data: studentData,
    isError,
    isLoading,
  } = useQuery<StudentData>("student", async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:4444/students/660e718fecbc71be7f89091e', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  });

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
            src={studentData.avatarUrl}
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
            <p>{studentData.personalSkills.map(skill => skill + ' ')}</p>
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
