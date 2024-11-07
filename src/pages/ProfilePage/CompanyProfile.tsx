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
import ModalChat from "../../components/modals/ModalChat/ModalChat";
import { CompanyData, CompanyFormData, JWT } from "../../types/DataTypes";
import { getCompany, updateCompanyProfile, uploadImage } from "./CompanyProfileAsync";


const CompanyProfile: React.FC = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<CompanyFormData>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: companyData, isError, isLoading, refetch } = useQuery<CompanyData>(["company", profileId], () => getCompany(profileId!));
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);   

  const token = localStorage.getItem("token");
  let myId: string | undefined;
  let userType: string | undefined;
  if (token) {
      const { _id, user } = jwtDecode<JWT>(token);
      myId = _id;
      userType = user;
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

  const handleSendMessage = async (message: string) => {
    try {
        const response = await fetch("http://localhost:4444/chats/message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                sender: myId,
                senderModel: userType,
                recipient: profileId,
                recipientModel: "Company",
                text: message,
                isResponseToVacancy: false,
            }),
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        setIsMessageSent(true);
        setTimeout(() => setIsMessageSent(false), 1500);
        setIsChatModalOpen(false);
    } catch (error) {
        console.error("Ошибка при отправке сообщения:", error);
    }
};

  const handleOpenChatModal = () => {
    setIsChatModalOpen(true);
  };
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
                  }}>Редактировать профиль</button>
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
                  onClick={token ? handleOpenChatModal : handleUnauthorizedAction}
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
            <div>
              <div>
                <h2>Активные вакансии 
                  {profileId === myId ? (
                  <button className={styles.addButton} onClick={() => navigate('/vacancy/new')}>
                    Добавить вакансию
                  </button>
                  ) : null}
                </h2>
              </div>
              <VacancyList companyId={companyData._id} />
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
        <ModalMessage
          message={passwordChangeMessage}
          onClose={() => setPasswordChangeMessage('')}
        />
      )}
      {isChatModalOpen && (
          <ModalChat
              isOpen={isChatModalOpen}
              onClose={() => setIsChatModalOpen(false)}
              onSend={handleSendMessage}
          />
      )}
      {isMessageSent && (
          <ModalMessage 
          onClose={() => setIsMessageSent(false)}
          message={`Сообщение отправлено`}>
          </ModalMessage>
      )}
    </div>
  );
};

export default CompanyProfile;
