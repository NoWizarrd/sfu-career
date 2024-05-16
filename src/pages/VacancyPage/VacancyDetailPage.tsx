import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import styles from "./VacancyDetailPage.module.scss";

interface VacancyData {
    _id: string;
    title: string;
    company: CompanyData;
    description: string;
    requiredSkills: string[];
    location: string;
    salary?: number;
    benefits: string[];
    isOpen: boolean;
}
interface CompanyData {
    _id: string;
    name: string;
    industry: string;
    location: string;
    avatarUrl: string;
    website: string;
}

const fetchVacancy = async (id: string) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:4444/vacancies/${id}`, {
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

const VacancyDetailPage: React.FC = () => {
    const { vacancyId } = useParams<{ vacancyId: string }>();
    const { data: vacancy, isLoading, error } = useQuery<VacancyData>(["vacancy", vacancyId], () => fetchVacancy(vacancyId!));

    if (isLoading) return <div className={styles.pageContainer}>Загрузка...</div>;
    if (error) return <div className={styles.pageContainer}>Ошибка загрузки данных.</div>;

    return (
        <div className={styles.pageContainer}>
            {vacancy ? (
                <div className={styles.vacancyDetailContainer}>
                    <div className={styles.vacancyHeader}>
                        <h2 className={styles.vacancyTitle}>{vacancy.title}</h2>
                        <div className={styles.vacancyMeta}>
                            {vacancy.salary && <p><strong>Зарплата: </strong>{vacancy.salary} руб.</p>}
                            <p><strong>Статус: </strong>{vacancy.isOpen ? "Открыта" : "Закрыта"}</p>
                        </div>
                        <div className={styles.buttonGroup}>
                            <button className={styles.applyButton}>Подать заявку</button>
                            <button className={styles.messageButton}>Написать сообщение</button>
                        </div>
                    </div>
                        <Link to={`/company/${vacancy.company._id}`}>
                            <div className={styles.companyInfo}>
                                    <h3>{vacancy.company.name}</h3>
                                    <p>{vacancy.company.location}</p>
                            </div>
                        </Link>
                    <div className={`${styles.vacancyDetails} ${styles.sectionSeparator}`}>
                        <p><strong>Навыки: </strong>{vacancy.requiredSkills.join(", ")}</p>
                        <p><strong>Местоположение: </strong>{vacancy.location}</p>
                        <p><strong>Описание: </strong>{vacancy.description}</p>
                        {vacancy.benefits.length > 0 && <p><strong>Преимущества: </strong>{vacancy.benefits.join(", ")}</p>}
                    </div>
                </div>
            ) : (
                <div className={styles.pageContainer}>Вакансия не найдена</div>
            )}
        </div>
    );
};

export default VacancyDetailPage;
