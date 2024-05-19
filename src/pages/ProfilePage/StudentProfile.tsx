import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ProfilePage.module.scss";
import noAvatar from "../../assets/noAvatar.jpg";
import { jwtDecode } from "jwt-decode";
import Loader from "../../components/loader/Loader";
import PracticeList from "../../components/practiceList/PracticeList";
import Select, { MultiValue, StylesConfig } from "react-select";
import ChangePasswordModal from "../../components/modals/ModalChangePassword/ChangePasswordModal";
import ModalMessage from "../../components/modals/ModalMessage/ModalMessage";

interface StudentData {
    _id: string;
    surname: string;
    name: string;
    patronymic: string;
    institute: string;
    specialty: string;
    course: number;
    practices: string[];
    avatarUrl: string;
    personalSkills: string[];
    about: string;
}

interface Skill {
    _id: string;
    skill: string;
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
interface FormData {
    avatarUrl?: string;
    avatarFile?: File;
    personalSkills?: SkillOption[];
    about?: string;
}


const getStudent = async (id: string): Promise<StudentData> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:4444/students/${id}`, {
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

const updateStudentProfile = async (id: string, data: Partial<StudentData>) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:4444/students/${id}`, {
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
        return data.map(skill => ({ value: skill._id, label: skill.skill }));
    } catch (error) {
        console.error('Ошибка при получении данных о навыках:', error);
        return [];
    }
};

const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem("token");
    const response = await fetch('http://localhost:4444/upload', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Ошибка при загрузке изображения');
    }

    const data = await response.json();
    return data.url;
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

const StudentProfile: React.FC = () => {
    const { profileId } = useParams<{ profileId: string }>();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<FormData>>({});
    const [skills, setSkills] = useState<SkillOption[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: studentData, isError, isLoading, refetch } = useQuery<StudentData>(["student", profileId], () => getStudent(profileId!));
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [passwordChangeMessage, setPasswordChangeMessage] = useState('');

   
    useEffect(() => {
        fetchSkills().then(data => setSkills(data));
    }, []);

    useEffect(() => {
        if (studentData) {
            setFormData({
                personalSkills: studentData.personalSkills?.map(mySkill => {
                    const skill = skills.find(s => s.label === mySkill);
                    return skill
                }).filter((skill): skill is SkillOption => skill !== undefined),
                about: studentData.about,
            });
        }
    }, [studentData, skills]);


    const token = localStorage.getItem("token");
    let myId: string | undefined;
    if (token) {
        const { _id } = jwtDecode<JWT>(token);
        myId = _id;
    }

    const exitFromProfile = () => {
        window.localStorage.removeItem("token");
        navigate("/login");
        location.reload();
    };

    const handleUnauthorizedAction = () => {
        setIsModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSkillsChange = (selectedOptions: MultiValue<SkillOption>) => {
        const mutableSelectedOptions = [...selectedOptions];
        setFormData({ ...formData, personalSkills: mutableSelectedOptions });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (upload) => {
                setFormData({ ...formData, avatarUrl: upload.target?.result as string, avatarFile: file });
            };
            reader.readAsDataURL(file);
        }
    };
    const handleChangePassword = () => {
        setIsChangePasswordModalOpen(true);
    };

    const handleSavePassword = async (newPassword: string) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:4444/students/${profileId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ password: newPassword }),
            });
    
            if (!response.ok) {
                throw new Error('Ошибка при смене пароля');
            }
            setPasswordChangeMessage('Пароль успешно изменен');
            setIsEditing(false);
            setIsChangePasswordModalOpen(false);
        } catch (error) {
            console.error('Ошибка:', error);
            setPasswordChangeMessage('Ошибка при смене пароля');
        }
    };
    
    

    const handleSave = async () => {
        try {
            let avatarUrl = formData.avatarUrl;
    
            if (formData.avatarFile) { // Проверяем, было ли выбрано новое изображение
                avatarUrl = await uploadImage(formData.avatarFile);
            }
    
            const updatedData = {
                ...formData,
                personalSkills: formData.personalSkills?.map(skill => skill.value) || [],
                avatarUrl,
            };
    
            await updateStudentProfile(profileId!, updatedData);
            refetch();
            setIsEditing(false);
        } catch (error) {
            console.error("Ошибка при обновлении профиля:", error);
        }
    };
    const baseURL = 'http://localhost:4444';


    if (isLoading) return <Loader />;
    if (isError || !studentData)
        return (
            <div className={styles.pageContainer}>
                <div>Ошибка загрузки данных студента.</div>
            </div>
        );

    return (
        <div className={styles.pageContainer}>
            <div className={styles.studentProfile}>
                <div className={styles.profileHeader}>
                <div className={`${styles.profilePhotoContainer} ${isEditing ? 'editing' : ''}`}>
                    <img
                        src={formData.avatarUrl ? `${baseURL}${formData.avatarUrl}` : studentData.avatarUrl ? `${baseURL}${studentData.avatarUrl}` : noAvatar}
                        alt="avatar"
                        className={styles.profilePhoto}
                    />
                    {isEditing && (
                        <label className={styles.avatarLabel}>
                            <input type="file" accept="image/*" onChange={handleAvatarChange} className={styles.avatarInput} />
                            Изменить
                        </label>
                    )}
                </div>

                    <div className={styles.profileInfo}>
                        <div className={styles.profileDetailsSectionFirst}>
                            <p>
                                <strong>ФИО:</strong> {studentData.surname} {studentData.name} {studentData.patronymic}
                            </p>
                            <p>
                                <strong>Институт:</strong> {studentData.institute}
                            </p>
                            <p>
                                <strong>Специальность:</strong> {studentData.specialty}
                            </p>
                            <p>
                                <strong>Курс:</strong> {studentData.course}
                            </p>
                        </div>
                    </div>
                    <div className={styles.profileButtons}>
                        {profileId === myId ? (
                            <>
                            {isEditing ? (
                                <>
                                    <button className={styles.saveButton} onClick={handleSave}>Сохранить</button>
                                    <button className={styles.changePasswordButton} onClick={handleChangePassword}>Сменить пароль</button>
                                    <button className={styles.cancelButton} onClick={() => setIsEditing(false)}>Отмена</button>
                                </>
                            ) : (
                                <button className={styles.editButton} onClick={() => {
                                    setIsEditing(true);
                                }}>Изменить данные</button>
                            )}
                            {!isEditing && (
                                <button className={styles.exitButton} onClick={exitFromProfile}>
                                    Выйти из аккаунта
                                </button>
                            )}
                        </>                        
                        ) : (
                            <button
                                className={styles.messageButton}
                                onClick={token ? () => { /* логика для авторизованных пользователей */ } : handleUnauthorizedAction}
                            >
                                Отправить сообщение
                            </button>
                        )}
                    </div>
                </div>
                <div className={styles.profileDetails}>
                    <div className={styles.profileDetailsSection}>
                        <h2>Профессиональные навыки</h2>
                        {isEditing ? (
                            <Select
                                isMulti
                                options={skills}
                                styles={customStyles}
                                className={styles.skillSelect}
                                onChange={handleSkillsChange}
                                value={skills.filter(option => formData.personalSkills ? formData.personalSkills.some(skill => skill.label === option.label) : studentData?.personalSkills.includes(option.value))}
                                placeholder="Выберите навыки..."
                            />
                        ) : (
                            <div className={styles.skills}>
                                {studentData.personalSkills.length > 0 ? (
                                    studentData.personalSkills.map((skill, index) => (
                                        <span key={index} className={styles.skill}>{skill}</span>
                                    ))
                                ) : (
                                    <p>Не указаны</p>
                                )}
                            </div>
                        )}
                    </div>
                    <div className={styles.profileDetailsSection}>
                        <h2>О себе</h2>
                        {isEditing ? (
                            <textarea
                                name="about"
                                value={formData.about ?? studentData.about}
                                onChange={handleInputChange}
                                className={styles.editText}
                            />
                        ) : (
                            <p>{studentData.about}</p>
                        )}
                    </div>
                    <div>
                        <h2>Пройденные практики</h2>
                        <PracticeList studentId={studentData._id} />
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <ModalMessage 
                onClose={() => setIsModalOpen(false)}
                message="Для выполнения этого действия необходимо авторизоваться">
                </ModalMessage>
            )}
            {isChangePasswordModalOpen && (
                <ChangePasswordModal 
                    isOpen={isChangePasswordModalOpen}
                    onClose={() => setIsChangePasswordModalOpen(false)}
                    onSave={handleSavePassword}
                />
            )}
            {passwordChangeMessage && (
                <div className={styles.passwordChangeMessage}>
                    {passwordChangeMessage}
                </div>
            )}
            {passwordChangeMessage && (
                <ModalMessage 
                    message={passwordChangeMessage}
                    onClose={() => setPasswordChangeMessage('')}
                />
            )}
        </div>
    );
};

export default StudentProfile;
