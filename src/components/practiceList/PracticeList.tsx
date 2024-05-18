import React, { useState } from "react";
import { useQuery } from "react-query";
import styles from "./PracticeList.module.scss";

interface PracticeData {
    _id: string;
    rating: number;
    company: { name: string } | null;
    companyName: string;
    practiceName: string;
    course: number;
    companyReview: string;
}

const fetchPractices = async (studentId: string) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:4444/students/${studentId}/practices`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
};

const courseNames: { [key: number]: string } = {
    1: 'Учебно-технологическая',
    2: 'Научно-исследовательская',
    3: 'Производственная',
    4: 'Преддипломная'
};

const PracticeList: React.FC<{ studentId: string }> = ({ studentId }) => {
    const { data: practices, isLoading, error } = useQuery<PracticeData[]>(["practices", studentId], () => fetchPractices(studentId));
    const [expandedPractices, setExpandedPractices] = useState<Set<string>>(new Set());

    const togglePractice = (id: string) => {
        setExpandedPractices(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const token = localStorage.getItem("token");
    if (!token) return <div className={styles.noPractices}>Практики видны только авторизированным пользователям</div>;
    if (isLoading) return <div className={styles.pageContainer}>Загрузка практик...</div>;
    if (error) return <div className={styles.pageContainer}>Ошибка загрузки данных.</div>;

    const sortedPractices = practices?.slice().sort((a, b) => a.course - b.course);

    return (
        <div className={styles.pageContainer}>
            {
                sortedPractices && sortedPractices.length > 0 ? (
                    sortedPractices.map(practice => (
                        <div key={practice._id} className={`${styles.practiceCard} ${expandedPractices.has(practice._id) ? styles.open : ''}`}>
                            <div className={styles.practiceHeader} onClick={() => togglePractice(practice._id)}>
                                <h3>{practice.course} курс ({courseNames[practice.course]})</h3>
                                <button className={styles.toggleButton}>
                                    {expandedPractices.has(practice._id) ? "▲" : "▼"}
                                </button>
                            </div>
                            {expandedPractices.has(practice._id) && (
                                <div className={styles.practiceDetails}>
                                    <p><strong>Название практики: </strong>{practice.practiceName}</p>
                                    <p><strong>Оценка: </strong>{practice.rating}</p>
                                    {
                                        practice.course == 4 ?
                                        <>
                                            <p><strong>Компания: </strong>Практика пройдена на кафедре</p>
                                        </>
                                        :
                                        <>
                                            <p><strong>Компания: </strong>{practice.company ? practice.company.name : practice.companyName}</p>
                                            <p><strong>Отзыв компании: </strong>{practice.companyReview}</p>
                                        </>
                                    } 
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className={styles.noPractices}>Нет данных о прохождении практик</div>
                )
            }
        </div>
    );
};

export default PracticeList;
