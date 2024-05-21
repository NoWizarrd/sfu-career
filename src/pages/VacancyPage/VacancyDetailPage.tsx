import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { jwtDecode } from "jwt-decode";
import Select, { MultiValue, StylesConfig } from "react-select";
import styles from "./VacancyDetailPage.module.scss";
import Loader from "../../components/loader/Loader";
import ModalMessage from "../../components/modals/ModalMessage/ModalMessage";
import DeleteVacancyModal from "../../components/modals/ModalDeleteVacancy/DeleteVacancyModal";

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

interface SkillOption {
    value: string;
    label: string;
}

interface Skill {
    _id: string;
    skill: string;
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

const updateVacancy = async (id: string, data: Partial<VacancyData>) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:4444/vacancies/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
};

const deleteVacancy = async (id: string) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:4444/vacancies/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
};

const fetchSkills = async (): Promise<SkillOption[]> => {
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
        return data.map((skill) => ({ value: skill._id, label: skill.skill }));
    } catch (error) {
        console.error('Ошибка при получении данных о навыках:', error);
        return [];
    }
};

const customStyles: StylesConfig<SkillOption, true> = {
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
        backgroundColor: '#36332e',
        color: '#fff',
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#fff',
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: '#fff',
        ':hover': {
            backgroundColor: '#36332e',
            color: '#fff',
        },
    }),
};

const VacancyDetailPage: React.FC = () => {
    const { vacancyId } = useParams<{ vacancyId: string }>();
    const navigate = useNavigate();
    const { data: vacancy, isLoading, error, refetch } = useQuery<VacancyData>(["vacancy", vacancyId], () => fetchVacancy(vacancyId!));
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<VacancyData>>({});
    const [skills, setSkills] = useState<SkillOption[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errors, setErrors] = useState<{ benefits?: string[] }>({});
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false);
    const token = localStorage.getItem('token');

    let userType: string | undefined;
    let userId: string | undefined;
    if (token) {
        const decodedToken = jwtDecode<JWT>(token);
        userType = decodedToken.user;
        userId = decodedToken._id;
    }

    useEffect(() => {
        fetchSkills().then(data => setSkills(data));
    }, []);

    useEffect(() => {
        if (vacancy) {
            setFormData({
                title: vacancy.title,
                salary: vacancy.salary,
                description: vacancy.description,
                benefits: vacancy.benefits,
                requiredSkills: vacancy.requiredSkills.map(skill => {
                    const skillOption = skills.find(s => s.label === skill);
                    return skillOption ? skillOption.value : "";
                }).filter(skill => skill !== "")
            });
        }
    }, [vacancy, skills]);

    function handleUnauthorizedAction() {
        setIsModalOpen(true);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSkillsChange = (selectedOptions: MultiValue<SkillOption>) => {
        const selectedSkills = selectedOptions ? selectedOptions.map((option) => option.value) : [];
        setFormData({ ...formData, requiredSkills: selectedSkills });
    };

    const handleSave = async () => {
        const benefitsErrors: string[] = [];
        if (formData.benefits) {
            formData.benefits.forEach((benefit, index) => {
                if (!benefit) {
                    benefitsErrors[index] = "Поле не может быть пустым";
                }
            });
        }

        if (benefitsErrors.length > 0) {
            setErrors({ benefits: benefitsErrors });
            return;
        }
        try {
            
            await updateVacancy(vacancyId!, formData);
            refetch();
            setIsEditing(false);
        } catch (error) {
            console.error("Ошибка при обновлении вакансии:", error);
        }
    };
    const handleBenefitChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedBenefits = formData.benefits ? [...formData.benefits] : [];
        updatedBenefits[index] = e.target.value;
        setFormData({ ...formData, benefits: updatedBenefits });
    };
    
    const handleRemoveBenefit = (index: number) => {
        const updatedBenefits = formData.benefits ? [...formData.benefits] : [];
        updatedBenefits.splice(index, 1);
        setFormData({ ...formData, benefits: updatedBenefits });
    };
    
    const handleAddBenefit = () => {
        const updatedBenefits = formData.benefits ? [...formData.benefits, ""] : [""];
        setFormData({ ...formData, benefits: updatedBenefits });
    };
    
    const handleDelete = async () => {
        try {
            await deleteVacancy(vacancyId!);
            setIsDeleteConfirmed(true);
            navigate(`/company/${vacancy?.company._id}`);
        } catch (error) {
            console.error("Ошибка при удалении вакансии:", error);
        }
    };

    const confirmDelete = () => {
        setIsDeleteModalOpen(true);
    };

    if (isLoading) return <Loader />
    if (error) return <div className={styles.pageContainer}>Ошибка загрузки данных.</div>;

    return (
        <div className={styles.pageContainer}>
            {vacancy ? (
                <div className={styles.vacancyDetailContainer}>
                    {isEditing ? (
                        <h2>Редактирование</h2>
                    ) : null}
                    <div className={styles.vacancyHeader}>
                        {isEditing ? (
                            <div className={styles.fieldContainer}>
                                <strong>Название вакансии:</strong>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title ?? ""}
                                    onChange={handleInputChange}
                                    className={styles.editText}
                                />
                            </div>
                        ) : (
                            <h2 className={styles.vacancyTitle}>{vacancy.title}</h2>
                        )}
                        <div className={styles.vacancyMeta}>
                            {isEditing ? (
                                <div className={styles.fieldContainer}>
                                    <strong>Зарплата:</strong>
                                    <input
                                        type="text"
                                        name="salary"
                                        value={formData.salary ?? ""}
                                        onChange={handleInputChange}
                                        className={styles.editText}
                                    />
                                </div>
                            ) : (
                                <>
                                    {vacancy.salary && (
                                        <p style={{ marginRight: "10px" }}>
                                            <strong>Зарплата: </strong>{vacancy.salary} руб.
                                        </p>
                                    )}
                                    <p>
                                        <strong>Статус: </strong>{vacancy.isOpen ? "Открыта" : "Закрыта"}
                                    </p>
                                </>
                            )}
                        </div>
                        <div className={styles.buttonGroup}>
                            {userType !== "company" ? (
                                <button className={styles.applyButton} onClick={token ? () => { /* логика для авторизованных пользователей */ } : handleUnauthorizedAction}>
                                    Откликнуться
                                </button>
                            ) : (
                                userId === vacancy.company._id && (
                                    <>
                                        {isEditing ? (
                                            <>
                                            </>
                                        ) : (
                                            <>
                                                <button className={styles.editButton} onClick={() => setIsEditing(true)}>Редактировать</button>
                                                <button className={styles.deleteButton} onClick={confirmDelete}>Удалить</button>
                                            </>
                                        )}
                                    </>
                                )
                            )}
                        </div>
                    </div>
                    {!isEditing && (
                        <Link to={`/company/${vacancy.company._id}`}>
                            <div className={styles.companyInfo}>
                                <h3>{vacancy.company.name}</h3>
                                <p>{vacancy.company.location}</p>
                            </div>
                        </Link>
                    )}
                    <div className={`${styles.vacancyDetails} ${styles.sectionSeparator}`}>
                        <div>
                            <h2>Необходимые навыки: </h2>
                            {isEditing ? (
                                <Select
                                    isMulti
                                    options={skills}
                                    styles={customStyles}
                                    onChange={handleSkillsChange}
                                    value={skills.filter(option => formData.requiredSkills?.includes(option.value))}
                                    placeholder="Выберите навыки..."
                                />
                            ) : (
                                <div className={styles.skills}>
                                {vacancy.requiredSkills.length > 0 ? (
                                    vacancy.requiredSkills.map((skill, index) => (
                                        <span key={index} className={styles.skill}>{skill}</span>
                                    ))
                                ) : (
                                    <p>Не указаны</p>
                                )}
                            </div>
                            )}
                        </div>
                        <div style={{marginTop: '10px'}}>
                            <h2>Описание: </h2>
                            {isEditing ? (
                                <textarea
                                    name="description"
                                    value={formData.description ?? ""}
                                    onChange={handleInputChange}
                                    className={styles.editText}
                                />
                            ) : (
                                <span>{vacancy.description}</span>
                            )}
                        </div>
                        <div style={{marginTop: '10px'}}>
                            <h2>Преимущества: </h2>
                            {isEditing ? (
                                <div>
                                    {formData.benefits?.map((benefit, index) => (
                                        <div key={index} className={styles.benefitItem}>
                                            <input
                                                type="text"
                                                name={`benefit-${index}`}
                                                value={benefit}
                                                onChange={(e) => handleBenefitChange(e, index)}
                                                className={styles.editSmallText}
                                            />
                                            {errors.benefits && errors.benefits[index] && (
                                                <span className={styles.errorMessage}>{errors.benefits[index]}</span>
                                            )}
                                            <button type="button" onClick={() => handleRemoveBenefit(index)} className={styles.removeButton}>
                                                Удалить
                                            </button>
                                        </div>
                                    ))}

                                    <button type="button" onClick={handleAddBenefit} className={styles.addButton}>
                                        Добавить преимущество
                                    </button>
                                </div>
                            ) : (
                                <ul className={styles.benefitsList}>
                                    {vacancy.benefits.map((benefit, index) => (
                                        <li key={index}>{benefit}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {
                            isEditing ?
                            <div className={styles.buttonGroup}>
                            <button className={styles.saveButton} onClick={handleSave}>Сохранить</button>
                            <button className={styles.cancelButton} onClick={() => setIsEditing(false)}>Отмена</button>
                            </div>
                        :null
                        }
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
            {vacancy && isDeleteModalOpen && (
                <DeleteVacancyModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDelete}
                    vacancyTitle={vacancy.title}
                />
            )}
            {isDeleteConfirmed && (
                <ModalMessage onClose={() => setIsDeleteConfirmed(false)} message="Вакансия удалена"></ModalMessage>
            )}
        </div>
    );
    
};

export default VacancyDetailPage;
