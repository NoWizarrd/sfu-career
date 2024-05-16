import React from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom"; 
import styles from "./ProfilePage.module.scss";
import noAvatar from "../../assets/noAvatar.jpg";
import {jwtDecode} from 'jwt-decode';

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
    _id: string,
    user: 'student' | 'company',
    exp: number,
    iat: number  
  }

  const getCompany = async (id: string): Promise<CompanyData> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:4444/companies/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    const data = await response.json();
    return data;
  }  

const CompanyProfile: React.FC = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const {
    data: companyData,
    isError,
    isLoading,
  } = useQuery<CompanyData>(["company", profileId], () => getCompany(profileId!));

  const token = localStorage.getItem('token');
  let myId: string | undefined
  if(token){
      const { _id } = jwtDecode<JWT>(token)
      myId = _id
  }

  function exitFromProfile() {
    window.localStorage.removeItem('token')
    navigate('/login');
    location.reload()
}

  if (isLoading) return(
    <div className={styles.pageContainer}>
        <div>Loading...</div>
    </div>
  )
  if (isError || !companyData) return(
    <div className={styles.pageContainer}>
        <div>Error loading the company data.</div>
    </div>
  )
  return (
    <div className={styles.pageContainer}>
        <div className={styles.companyProfile}>
        <div className={styles.profileHeader}>
            <img
            src={companyData.avatarUrl ? companyData.avatarUrl : noAvatar}
            alt="avatar"
            className={styles.profilePhoto}
            />
            <div className={styles.profileInfo}>
            <div className={styles.profileDetailsSection}>
                <p><strong>Название:</strong> {companyData.name}</p>
                <p><strong>Отрасль:</strong> {companyData.industry}</p>
                <p><strong>Местоположение:</strong> {companyData.location}</p>
                <p><strong>Сайт:</strong> <a href={companyData.website} target="_blank" rel="noopener noreferrer">{companyData.website}</a></p>
            </div>
            </div>
        </div>
        <div className={styles.profileDetails}>
            <div className={styles.profileDetailsSection}>
            <h2>Описание</h2>

            <p>{companyData.description}</p>
            </div>
            {
              profileId === myId 
              ?
              <>
                <button className={styles.editButton}>Изменить данные</button>
                <button className={styles.exitButton} onClick={exitFromProfile}>Выйти из аккаунта</button>
              </>
              :
              <button className={styles.messageButton}>Отправить сообщение</button>
            }
        </div>
        </div>
    </div>
  );
};

export default CompanyProfile;