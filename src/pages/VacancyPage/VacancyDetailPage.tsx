import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import {jwtDecode} from "jwt-decode";
import styles from "./VacancyDetailPage.module.scss";
import Loader from "../../components/loader/Loader";
import ModalMessage from "../../components/modals/ModalMessage/ModalMessage";

interface VacancyData {
    _id: string;
    title: string;
    company: CompanyData;
    description: string;
    requiredSkills: string[];
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

interface JWT {
    _id: string;
    user: "student" | "company";
    exp: number;
    iat: number;
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const token = localStorage.getItem('token');
    
    let userType: string | undefined;
    let userId: string | undefined;
    if (token) {
        const decodedToken = jwtDecode<JWT>(token);
        userType = decodedToken.user;
        userId = decodedToken._id;
    }

    function handleUnauthorizedAction() {
        setIsModalOpen(true);
    }

    if (isLoading) return <Loader />
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
                            {userType !== "company" ? (
                                <button className={styles.applyButton}
                                        onClick={token ? () => { /* логика для авторизованных пользователей */ } : handleUnauthorizedAction}
                                >
                                    Откликнуться
                                </button>
                            ) : (
                                userId === vacancy.company._id && (
                                    <>
                                    <button className={styles.editButton}
                                            onClick={() => null}
                                    >
                                        Редактировать
                                    </button>
                                    <button className={styles.deleteButton}
                                            onClick={() => null}
                                    >
                                        Удалить
                                    </button>
                                    </>
                                )
                            )}
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
                        <p><strong>Описание: </strong>{vacancy.description}</p>
                        {vacancy.benefits.length > 0 && <p><strong>Преимущества: </strong>{vacancy.benefits.join(", ")}</p>}
                    </div>
                </div>
            ) : (
                <div className={styles.pageContainer}>Вакансия не найдена</div>
            )}
            {isModalOpen && (
                <ModalMessage 
                onClose={() => setIsModalOpen(false)}
                message="Для выполнения этого действия необходимо авторизоваться">
                </ModalMessage>
            )}
        </div>
    );
};

export default VacancyDetailPage;
