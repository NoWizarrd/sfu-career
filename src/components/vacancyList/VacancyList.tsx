import React from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styles from "./VacancyList.module.scss";

interface VacancyData {
    _id: string;
    title: string;
    isOpen: boolean;
}

const fetchCompanyVacancies = async (companyId: string) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:4444/companies/${companyId}/vacancies`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
};

const VacancyList: React.FC<{ companyId: string }> = ({ companyId }) => {
    const { data: vacancies, isLoading, error } = useQuery<VacancyData[]>(["vacancies", companyId], () => fetchCompanyVacancies(companyId));
    const navigate = useNavigate();
    if (isLoading) return <div className={styles.noVacancies}>Загрузка вакансий</div>;
    if (error) return <div className={styles.pageContainer}>Ошибка загрузки данных.</div>;

    return (
        <div className={styles.vacancyList}>
            {vacancies && vacancies.length > 0 ? (
                vacancies.map((vacancy) => (
                    <div key={vacancy._id} className={styles.vacancyItem}>
                        <p>{vacancy.title}</p>
                        <div className={styles.vacancyActions}>
                            <button onClick={() => navigate(`/vacancy/${vacancy._id}`)}>Открыть</button>
                        </div>
                    </div>
                ))
            ) : (
                <div className={styles.noVacancies}>Нет активных вакансий</div>
            )}
        </div>
    );
};

export default VacancyList;
