import { Skill, SkillOption, StudentData } from "../../types/DataTypes";

export const getStudent = async (id: string): Promise<StudentData> => {
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

export const updateStudentProfile = async (id: string, data: Partial<StudentData>) => {
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

export const fetchSkills = async (): Promise<SkillOption[]> => {
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

export const uploadImage = async (file: File): Promise<string> => {
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