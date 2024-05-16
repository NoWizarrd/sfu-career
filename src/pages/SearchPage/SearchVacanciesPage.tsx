import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import styles from "./SearchPage.module.scss";
import { Link } from "react-router-dom";
import Select from 'react-select';

interface CompanyData {
    _id: string;
    name: string;
    industry: string;
    location: string;
    avatarUrl: string;
}

type SkillsData = { value: string; label: string };

interface Vacancy {
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

interface SearchFilters {
    skills: string[];
    location: string;
    title: string;
}
interface Skill {
    _id: string;
    skill: string;
    __v: number;
}

async function fetchVacancies() {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:4444/vacancies`, {
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
}


const fetchSkills = async (): Promise<SkillsData[]> => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:4444/skills', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: Skill[] = await response.json();
        return data.map(skill => ({ value: skill._id, label: skill.skill }));
    } catch (error) {
        console.error('Ошибка при получении данных о навыках:', error);
        return [];
    }
};

const SearchVacanciesPage: React.FC = () => {
    const [skills, setSkills] = useState<SkillsData[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<SkillsData[]>([]);
    const [searchFilters, setSearchFilters] = useState<SearchFilters>({
        skills: [],
        location: "",
        title: "",
    });

    useEffect(() => {
        fetchSkills().then(data => {
            data.sort((a, b) => a.label.localeCompare(b.label));
            setSkills(data);
        });
    }, []);

    const { data: searchResults, isLoading, error } = useQuery<Vacancy[]>("vacancies", fetchVacancies, { keepPreviousData: true });

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = event.target;
        setSearchFilters((prevFilters) => ({
            ...prevFilters,
            [id]: value,
        }));
    };

    const handleSkillChange = (selectedOptions: SkillsData[]) => {
        setSelectedSkills(selectedOptions);
        setSearchFilters(prevFilters => ({
            ...prevFilters,
            skills: selectedOptions.map(option => option.value),
        }));
    };

    const filteredResults = searchResults?.filter((vacancy) =>
        (searchFilters.skills.length === 0 ||
            selectedSkills.every((selectedSkill) =>
                vacancy.requiredSkills.includes(selectedSkill.label)
            )) &&
        (searchFilters.title === "" ||
            vacancy.title.toLowerCase().includes(searchFilters.title.toLowerCase()))
    );

    return (
        <div className={styles.root}>
            <div className={styles.searchContainer}>
                <div className={styles.header}>Поиск вакансий</div>
                <div className={styles.filters}>
                    <div className={styles.filterOptions}>
                        <div className={styles.filterOption}>
                            <label htmlFor="skill">Навык:</label>
                            <Select
                                id='skill'
                                isMulti
                                options={skills}
                                className={styles.skillSelect}
                                onChange={handleSkillChange}
                                value={selectedSkills}
                                placeholder="Выберите навыки..."
                            />
                        </div>
                        <div className={styles.filterOption}>
                            <label htmlFor="title">Название вакансии:</label>
                            <input
                                type="text"
                                id="title"
                                value={searchFilters.title}
                                onChange={handleFilterChange}
                                placeholder="Введите название вакансии"
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.searchResults}>
                    {isLoading ? (
                        <div>Загрузка...</div>
                    ) : error ? (
                        <div>Ошибка загрузки данных.</div>
                    ) : filteredResults && filteredResults.length > 0 ? (
                        <>
                            {filteredResults.map((vacancy) => (
                                <div className={styles.resultItem} key={vacancy._id}>
                                    <div className={styles.resultContent}>
                                        <h3>{vacancy.title}</h3>
                                        <p>
                                            <strong>Компания: </strong>
                                            <Link to={`/company/${vacancy.company._id}`}>{vacancy.company.name}</Link>
                                        </p>
                                        <p>
                                            <strong>Необходимые навыки: </strong>
                                            {vacancy.requiredSkills.map(skill => skill).join(", ")}
                                        </p>
                                        {vacancy.salary ? <p><strong>Зарплата: </strong>{vacancy.salary} руб.</p> :<p><strong>Зарплата: </strong>Не указана</p>}
                                    </div>
                                    <Link to={`/vacancy/${vacancy._id}`} className={styles.profileButton}>Подробнее</Link>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className={styles.noResult}>Нет совпадений</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchVacanciesPage;
