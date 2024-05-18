import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import styles from "./SearchPage.module.scss";
import { Link } from "react-router-dom";
import Select, { StylesConfig } from 'react-select';
import Loader from "../../components/loader/Loader";

interface Student {
    _id: string;
    surname: string;
    name: string;
    patronymic: string;
    institute: string;
    course: number;
    specialty: string;
    avatarUrl: string;
    personalSkills: string[];
}

interface SearchFilters {
    personalSkills: string[];
    course: string;
    specialty: string,
    institute: string;
}

interface Skill {
    _id: string;
    skill: string;
    __v: number;
}

type SkillsData = { value: string; label: string };

const customStyles: StylesConfig<SkillsData,true> = {
    control: (provided, state) => ({
        ...provided,
        borderColor: state.isFocused ? '#a8a8a8' : '#cfcfcf', 
        '&:hover': {
            borderColor: '#a8a8a8',
        },
        boxShadow: state.isFocused ? '0 0 0 1px #a8a8a8' : undefined, 
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: '#e0e0e0',
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#000',
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: '#000',
        ':hover': {
            backgroundColor: '#d3d3d3',
            color: '#000',
        },
    }),
};

async function fetchStudents() {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:4444/students`, {
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

const fetchSkills = async ():Promise<SkillsData[]> => {
    const token = localStorage.getItem('token')
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

const SearchStudentPage: React.FC = () => {
    const [skills, setSkills] = useState<SkillsData[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<SkillsData[]>([]);

    const [searchFilters, setSearchFilters] = useState<SearchFilters>({
        personalSkills: [],
        course: "",
        specialty: "",
        institute: "",
    });
    useEffect(() => {
        fetchSkills().then(data => {
            data.sort((a,b)=> (a.label).localeCompare(b.label))
            setSkills(data)
    })
    }, []);

    const {data: searchResults, isLoading, error} = useQuery<Student[]>("students", fetchStudents, {keepPreviousData: true});

    const handleFilterChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { id, value } = event.target;
        setSearchFilters((prevFilters) => ({
            ...prevFilters,
            [id]: value,
        }));
    };
    
    const handleSkillChange = (selectedOptions: readonly SkillsData[]) => {
        const mutableSelectedOptions = [...selectedOptions];
        setSelectedSkills(mutableSelectedOptions);
        setSearchFilters(prevFilters => ({
            ...prevFilters,
            personalSkills: selectedOptions.map(option => option.value)
        }));
    };

    const filteredResults = searchResults?.filter((student) =>
        (searchFilters.personalSkills.length === 0 ||
          selectedSkills.every((selectedSkill) =>
            student.personalSkills.includes(selectedSkill.label)
          )) &&
        (searchFilters.course === "" ||
          student.course.toString() === searchFilters.course) &&
          (searchFilters.specialty === "" ||
            student.specialty.toLowerCase().includes(searchFilters.specialty.toLowerCase())) &&
        (searchFilters.institute === "" ||
          student.institute.toLowerCase().includes(searchFilters.institute.toLowerCase()))
      );

    if (isLoading) return(<Loader/>)
        
    return (
        <div className={styles.root}>
            <div className={styles.searchContainer}>
            <div className={styles.header}>Поиск студентов</div>
                <div className={styles.filters}>
                    <div className={styles.filterOptions}>
                        <div className={styles.filterOption}>
                            <label htmlFor="course">Курс:</label>
                            <select
                                id="course"
                                value={searchFilters.course}
                                onChange={handleFilterChange}
                            >
                                <option value="">Все</option>
                                <option value="1">1 курс</option>
                                <option value="2">2 курс</option>
                                <option value="3">3 курс</option>
                                <option value="4">4 курс</option>
                                <option value="5">5 курс</option>
                            </select>
                        </div>
                        <div className={styles.filterOption}>
                            <label htmlFor="specialty">Специальность:</label>
                            <input
                                type="text"
                                id="specialty"
                                value={searchFilters.specialty}
                                onChange={handleFilterChange}
                                placeholder="Введите наименование специальности"
                            />
                        </div>
                        <div className={styles.filterOption}>
                            <label htmlFor="institute">Институт:</label>
                            <input
                                type="text"
                                id="institute"
                                value={searchFilters.institute}
                                onChange={handleFilterChange}
                                placeholder="Введите название института"
                            />
                        </div>
                        <div className={styles.filterOption}>
                            <label htmlFor="skill">Навыки:</label>
                            <Select
                                id='skill'
                                isMulti
                                options={skills}
                                styles={customStyles}
                                className={styles.skillSelect}
                                onChange={handleSkillChange}
                                value={selectedSkills}
                                placeholder="Выберите навыки..."
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.searchResults}>
                    {error ? (
                        <div>Ошибка загрузки данных.</div>
                    ) : filteredResults && filteredResults.length > 0 ? (
                        <>
                            {filteredResults.map((student) => (
                                <div
                                    className={styles.resultItem}
                                    key={student._id}
                                >
                                    <div className={styles.resultContent}>
                                        <h3>
                                            {student.surname} {student.name} {student.patronymic}
                                        </h3>
                                        <p>
                                            <strong>Институт: </strong>
                                            {student.institute}
                                        </p>
                                        <p>
                                            <strong>Курс: </strong>
                                            {student.course}
                                        </p>
                                        <p>
                                            <strong>Специальность: </strong>
                                            {student.specialty}
                                        </p>
                                        <p>
                                            <strong>Навыки: </strong>
                                            {student.personalSkills.length 
                                            ?
                                            student.personalSkills.join(", ")
                                            :
                                            "Не указаны"}
                                        </p>
                                    </div>
                                    <Link to={`/student/${student._id}`} className={styles.profileButton}>Подробнее</Link>
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

export default SearchStudentPage;
