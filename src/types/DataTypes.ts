
export interface JWT {
    _id: string;
    user: "student" | "company";
    exp: number;
    iat: number;
  }

export interface PracticeData {
    _id: string;
    rating: number;
    company: { name: string } | null;
    companyName: string;
    practiceName: string;
    course: number;
    companyReview: string;
}

export interface CompanyFormData {
    avatarUrl?: string;
    avatarFile?: File;
    location?: string;
    description?: string;
    website: string;
  }

export interface CompanyData {
    _id: string;
    name: string;
    industry: string;
    location: string;
    description: string;
    avatarUrl: string;
    website: string;
  }

 export  interface StudentData {
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
    about?: string;
}

export interface Skill {
    _id: string;
    skill: string;
    __v?: number;
}


export interface SkillOption {
    value: string;
    label: string;
}
export interface StudentFormData {
    avatarUrl?: string;
    avatarFile?: File;
    personalSkills?: SkillOption[];
    about?: string;
}

export interface VacancyData {
    title: string;
    description: string;
    requiredSkills: string[];
    salary?: number;
    benefits: string[];
    isOpen: boolean;
    company: string;
}