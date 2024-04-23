import React, { useState } from 'react';
import { useQuery } from 'react-query';
import styles from './SearchPage.module.scss';

interface Student {
    _id: number;
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
    personalSkills: string[]; // Явно указываем тип для personalSkills
    course: string;
    institute: string;
}

const SearchPage: React.FC = () => {
    const [searchFilters, setSearchFilters] = useState<SearchFilters>({
        personalSkills: [],
        course: '',
        institute: ''
    });

    //try catch
    const { data: searchResults, isLoading, error } = useQuery<Student[]>(
        'students',
        async () => {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:4444/students`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        }
    );

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = event.target;
        setSearchFilters(prevFilters => ({
            ...prevFilters,
            [id]: value
        }));
    };

    const filteredResults = searchResults?.filter(student =>
        (searchFilters.personalSkills.length === 0 || student.personalSkills.some(skill => searchFilters.personalSkills.includes(skill))) &&
        (searchFilters.course === '' || student.course.toString() === searchFilters.course) &&
        (searchFilters.institute === '' || student.institute.toLowerCase().includes(searchFilters.institute.toLowerCase()))
    );

    const handleProfileOpen = (studentId: number) => {
        console.log(`Открыть профиль студента с ID: ${studentId}`);
    };

    return (
        <div className={styles.root}>
            <div className={styles.searchContainer}>
                <div className={styles.filters}>
                <div className={styles.filterOptions}>
    <div className={styles.filterOption}>
                            <label htmlFor="skill">Навык:</label>
                            <select
                                id="skill"
                                value={searchFilters.personalSkills}
                                onChange={handleFilterChange}
                            >
                                <option value="">Выберите навык</option>
                                <option value="programming">Программирование</option>
                                <option value="design">Дизайн</option>
                                {/* Другие опции... */}
                            </select>
    </div>
    <div className={styles.filterOption}>
        <label htmlFor="course">Курс:</label>
        <select
            id="course"
            value={searchFilters.course}
            onChange={handleFilterChange}
        >
            <option value="">Выберите курс</option>
            <option value="1">1 курс</option>
            <option value="2">2 курс</option>
            <option value="3">3 курс</option>
            <option value="4">4 курс</option>
            <option value="5">5 курс</option>
        </select>
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
</div>
                </div>

                <div className={styles.searchResults}>
                    {isLoading ? (
                        <div>Загрузка...</div>
                    ) : error ? (
                        <div>Ошибка загрузки данных.</div>
                    ) : (
                        <>
                            {filteredResults?.map(student => (
                                <div className={styles.resultItem} key={student._id}>
                                    <div className={styles.resultContent}>
                                        <h3>{student.surname} {student.name} {student.patronymic}</h3>
                                        <p>Институт: {student.institute}</p>
                                        <p>Курс: {student.course}</p>
                                        <p>Специальность: {student.specialty}</p>
                                        <p>Навыки: {student.personalSkills.join(', ')}</p>
                                    </div>
                                    <button
                                        className={styles.profileButton}
                                        onClick={() => handleProfileOpen(student._id)}
                                    >
                                        Подробнее
                                    </button>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
