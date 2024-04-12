import { useState, useEffect } from 'react';
import styles from './SearchPage.module.scss'; // Импорт модульных стилей

interface SearchResult {
    id: number;
    title: string;
    description: string;
}

function SearchPage() {
    const isAuthenticated = true
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

    // Моковые данные для демонстрации (можно заменить на запрос к бэкенду)
    useEffect(() => {
        const mockData: SearchResult[] = [
            { id: 1, title: 'Студент 1', description: 'Описание студента 1' },
            { id: 2, title: 'Студент 2', description: 'Описание студента 2' },
            { id: 3, title: 'Студент 3', description: 'Описание студента 3' },
            { id: 4, title: 'Вакансия 1', description: 'Описание вакансии 1' },
            { id: 5, title: 'Вакансия 2', description: 'Описание вакансии 2' },
            { id: 6, title: 'Вакансия 3', description: 'Описание вакансии 3' },
        ];
        setSearchResults(mockData);
    }, []);

    const handleProfileOpen = (id: number) => {
        // Логика для открытия профиля студента или вакансии
        console.log(`Открыть профиль с id ${id}`);
    };

    return (
        <div className={styles.root}>
            <div className={styles.searchContainer}>
                <div className={styles.filters}>
                    <h2>Фильтры поиска</h2>
                    <div className={styles.filterOptions}>
                        {isAuthenticated ? (
                            // Фильтры для студентов
                            <>
                                <div className={styles.filterOption}>
                                    <label htmlFor="skill">Навык:</label>
                                    <select id="skill">
                                        <option value="">Выберите навык</option>
                                        <option value="programming">Программирование</option>
                                        <option value="design">Дизайн</option>
                                        {/* Другие опции... */}
                                    </select>
                                </div>
                                <div className={styles.filterOption}>
                                    <label htmlFor="specialtyCode">Код специальности:</label>
                                    <input type="text" id="specialtyCode" placeholder="Введите код специальности" />
                                </div>
                            </>
                        ) : (
                            // Фильтры для компаний
                            <>
                                <div className={styles.filterOption}>
                                    <label htmlFor="skill">Навык:</label>
                                    <select id="skill">
                                        <option value="">Выберите навык</option>
                                        <option value="programming">Программирование</option>
                                        <option value="design">Дизайн</option>
                                        {/* Другие опции... */}
                                    </select>
                                </div>
                                <div className={styles.filterOption}>
                                    <label htmlFor="course">Курс:</label>
                                    <input type="number" id="course" min="1" placeholder="Введите курс" />
                                </div>
                                <div className={styles.filterOption}>
                                    <label htmlFor="institute">Институт:</label>
                                    <input type="text" id="institute" placeholder="Введите название института" />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className={styles.searchResults}>
                    <h2>Результаты поиска</h2>
                    {searchResults.map(result => (
                        <div className={styles.resultItem} key={result.id}>
                            <div className={styles.resultContent}>
                                <h3>{result.title}</h3>
                                <p>{result.description}</p>
                            </div>
                            <button
                                className={styles.profileButton}
                                onClick={() => handleProfileOpen(result.id)}
                            >
                                Подробнее
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
