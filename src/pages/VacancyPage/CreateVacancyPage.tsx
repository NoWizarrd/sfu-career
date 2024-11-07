import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select, { MultiValue, StylesConfig } from "react-select";
import styles from "./VacancyDetailPage.module.scss";
import { jwtDecode } from "jwt-decode";
import ModalMessage from "../../components/modals/ModalMessage/ModalMessage";
import { JWT, Skill, VacancyData } from "../../types/DataTypes";

interface SkillOption {
    value: string;
    label: string;
}

const createVacancy = async (data: Partial<VacancyData>) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:4444/vacancies`, {
        method: "POST",
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

const CreateVacancyPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Partial<VacancyData>>({
        title: "",
        description: "",
        requiredSkills: [],
        benefits: [""],
        isOpen: true,
        company: ""
    });
    const [skills, setSkills] = useState<SkillOption[]>([]);
    const [errors, setErrors] = useState<{ title?: string, description?: string, salary?: string, benefits?: string[] }>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSuccessOpen, setIsModalSuccessOpen] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) navigate('/notfound');
        if (token) {
            const decodedToken = jwtDecode<JWT>(token);
            if (decodedToken.user === "student") {
                navigate('/notfound');
            } else {
                setFormData(prev => ({ ...prev, company: decodedToken._id }));
            }
        }
        fetchSkills().then(data => setSkills(data));
    }, [navigate, token]);

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
        const newErrors: { title?: string, description?: string, salary?: string, benefits?: string[] } = {};

        if (!formData.title) {
            newErrors.title = "Поле не может быть пустым";
        }

        if (!formData.description) {
            newErrors.description = "Поле не может быть пустым";
        }

        if (formData.salary && isNaN(Number(formData.salary))) {
            newErrors.salary = "Поле должно содержать только цифры";
        }

        if (formData.benefits) {
            formData.benefits.forEach((benefit, index) => {
                if (!benefit) {
                    benefitsErrors[index] = "Поле не может быть пустым";
                }
            });
        }

        if (Object.keys(newErrors).length > 0 || benefitsErrors.length > 0) {
            setErrors({ ...newErrors, benefits: benefitsErrors });
            return;
        }

        const dataToSend = { ...formData };
        if (!dataToSend.salary) {
            delete dataToSend.salary;
        }

        try {
            await createVacancy(dataToSend);
            setIsModalSuccessOpen(true)
            setTimeout(() => {
                navigate(`/company/${formData.company}`);
            }, 2000);
        } catch (error) {
            console.error("Ошибка при создании вакансии:", error);
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

    return (
        <div className={styles.pageContainer}>
            <div className={styles.vacancyDetailContainer}>
                <h2>Создание новой вакансии</h2>
                <div className={styles.vacancyHeader}>
                    <div className={styles.fieldContainer}>
                        <strong>Название вакансии:</strong>
                        <input
                            type="text"
                            name="title"
                            value={formData.title ?? ""}
                            onChange={handleInputChange}
                            className={styles.editText}
                        />
                        {errors.title && <span className={styles.errorMessage}>{errors.title}</span>}
                    </div>
                    <div className={styles.vacancyMeta}>
                        <div className={styles.fieldContainerSalary}>
                            <strong>Зарплата: (опционально)</strong>
                            <input
                                type="text"
                                name="salary"
                                value={formData.salary ?? ""}
                                onChange={handleInputChange}
                                className={styles.editText}
                            />
                            {errors.salary && <span className={styles.errorMessage}>{errors.salary}</span>}
                        </div>
                    </div>
                </div>
                <div className={`${styles.vacancyDetails} ${styles.sectionSeparator}`}>
                    <div>
                        <h2>Необходимые навыки:</h2>
                        <Select
                            isMulti
                            options={skills}
                            styles={customStyles}
                            onChange={handleSkillsChange}
                            value={skills.filter(option => formData.requiredSkills?.includes(option.value))}
                            placeholder="Выберите навыки..."
                        />
                    </div>
                    <div style={{ marginTop: '10px' }} className={styles.fieldContainer}>
                        <h2>Описание:</h2>
                        <textarea
                            name="description"
                            value={formData.description ?? ""}
                            onChange={handleInputChange}
                            className={styles.editText}
                        />
                        {errors.description && <span className={styles.errorMessage}>{errors.description}</span>}
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <h2>Преимущества:</h2>
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
                    </div>
                </div>
                <div className={styles.buttonGroup}>
                    <button className={styles.saveButton} onClick={handleSave}>Сохранить</button>
                    <button className={styles.cancelButton} onClick={() => navigate(`/company/${formData.company}`)}>Отмена</button>
                </div>
            </div>
            {isModalSuccessOpen && (
                <ModalMessage
                    onClose={() => setIsModalSuccessOpen(false)}
                    message="Вакансия успешно размещена">
                </ModalMessage>
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

export default CreateVacancyPage;
