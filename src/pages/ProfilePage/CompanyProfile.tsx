import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ProfilePage.module.scss";
import noAvatar from "../../assets/noAvatar.jpg";
import { jwtDecode } from "jwt-decode";
import Loader from "../../components/loader/Loader";
import VacancyList from "../../components/vacancyList/VacancyList";
import ModalMessage from "../../components/modals/ModalMessage/ModalMessage";
import ChangePasswordModal from "../../components/modals/ModalChangePassword/ChangePasswordModal";

interface CompanyData {
  _id: string;
  name: string;
  industry: string;
  location: string;
  description: string;
  avatarUrl: string;
  website: string;
}

interface JWT {
  _id: string;
  user: "student" | "company";
  exp: number;
  iat: number;
}

interface CompanyFormData {
  avatarUrl?: string;
  avatarFile?: File;
  location?: string;
  description?: string;
  website: string;
}

const getCompany = async (id: string): Promise<CompanyData> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:4444/companies/${id}`, {
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

const updateCompanyProfile = async (id: string, data: Partial<CompanyData>) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:4444/companies/${id}`, {
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

const CompanyProfile: React.FC = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<CompanyFormData>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: companyData, isError, isLoading, refetch } = useQuery<CompanyData>(["company", profileId], () => getCompany(profileId!));
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');

  const token = localStorage.getItem("token");
  let myId: string | undefined;
  if (token) {
    const { _id } = jwtDecode<JWT>(token);
    myId = _id;
  }

  useEffect(() => {
    if (companyData) {
      setFormData({
        location: companyData.location,
        website: companyData.website,
        description: companyData.description,
        avatarUrl: companyData.avatarUrl
      });
    }
  }, [companyData]);

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

const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (upload) => {
          setFormData((prevFormData) => ({
              ...prevFormData,
              avatarUrl: upload.target?.result as string,
              avatarFile: file,
          }));
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
      const response = await fetch(`http://localhost:4444/companies/${profileId}`, {
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

      if (formData.avatarFile) {
        avatarUrl = await uploadImage(formData.avatarFile);
      }

      const updatedData = {
        ...formData,
        avatarUrl,
      };

      await updateCompanyProfile(profileId!, updatedData);
      refetch();
      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
    }
  };

  const baseURL = 'http://localhost:4444';

  if (isLoading) return <Loader />;
  if (isError || !companyData)
    return (
      <div className={styles.pageContainer}>
        <div>Ошибка загрузки данных компании.</div>
      </div>
    );
    console.log(formData)
  return (
    <div className={styles.pageContainer}>
      <div className={styles.companyProfile}>
        <div className={styles.profileHeader}>
          <div className={`${styles.profilePhotoContainer} ${isEditing ? 'editing' : ''}`}>
          <img
              src={
                  formData.avatarUrl && !formData.avatarUrl.startsWith('/uploads')
                      ? formData.avatarUrl
                      : companyData.avatarUrl
                          ? companyData.avatarUrl.startsWith('http') ? companyData.avatarUrl : `${baseURL}${companyData.avatarUrl}`
                          : noAvatar
              }
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
              <p><strong>Название:</strong> {companyData.name}</p>
              <p><strong>Отрасль:</strong> {companyData.industry}</p>
              {isEditing ? (
                <p className={styles.fieldContainer}>
                  <strong>Местоположение:</strong>
                  <input
                    type="text"
                    name="location"
                    value={formData.location ?? companyData.location}
                    onChange={handleInputChange}
                    className={styles.editSmallText}
                  />
                </p>
  
              ) : (
                <p><strong>Местоположение:</strong> {companyData.location}</p>
              )}
              {isEditing ? (
                <p className={styles.fieldContainer}>
                  <strong>Сайт:</strong>
                  <input
                    type="text"
                    name="website"
                    value={formData.website ?? companyData.website}
                    onChange={handleInputChange}
                    className={styles.editSmallText}
                  />
                </p>
              ) : (
                <p >
                  <strong style={{marginRight: "5px"}}>Сайт:</strong> 
                  <a href={companyData.website} className={styles.website} target="_blank" 
                     rel="noopener noreferrer">{companyData.website}
                  </a>
                </p>
              )}
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
            <h2>Описание</h2>
            {isEditing ? (
              <textarea
                name="description"
                value={formData.description ?? companyData.description}
                onChange={handleInputChange}
                className={styles.editText}
              />
            ) : (
              <p>{companyData.description}</p>
            )}
          </div>
          {profileId === myId ? (
            <div>
              <h2>Активные вакансии</h2>
              <VacancyList companyId={companyData._id} />
            </div>
          ) : null}
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
        <ModalMessage
          message={passwordChangeMessage}
          onClose={() => setPasswordChangeMessage('')}
        />
      )}
    </div>
  );
};

export default CompanyProfile;
