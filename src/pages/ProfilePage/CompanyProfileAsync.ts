import { CompanyData } from "../../types/DataTypes";


export const getCompany = async (id: string): Promise<CompanyData> => {
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
  
export   const updateCompanyProfile = async (id: string, data: Partial<CompanyData>) => {
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
  
 export  const uploadImage = async (file: File): Promise<string> => {
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