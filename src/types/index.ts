// src/types/index.ts

export interface FlashEvent {
  title: string;
  heroImage: string;
  aboutFlash: string;
  aboutImage?: string;
  eventDate: string; // Format: "YYYY-MM-DDTHH:mm"
  activities: Activity[];
  competitions: Competition[];
  gallery: string[];
}

export interface Activity {
  name: string;
  description: string;
  image: string;
}

export interface Competition {
  name: string;
  description: string;
  rules: string[];
  icon: string;
  type: 'single' | 'team';
  teamSize?: number;
}
export interface Registration {
  id?: string;
  name?: string;
  email: string;
  school?: string;
  competition: string;
  status: 'pending' | 'approved' | 'rejected';
  registrantName?: string;
  teamName?: string;
  teamMembers?: string[];
  gender?: 'Laki-laki' | 'Perempuan';
  birthDate?: string;
  whatsapp: string;
  schoolCategory?: SchoolCategory;
  city: AcehCity;
  ktsSuratAktif?: string; // URL of the uploaded file
  buktiPembayaran: string; // URL of the uploaded file
}

export interface DashboardStats {
  totalRegistrations: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
  rejectedRegistrations: number;
}

export interface School {
  name: string;
  category: SchoolCategory;
}

export interface City {
  name: AcehCity;
}

export type SchoolCategory = 'SD' | 'SMP' | 'SMA';

export type AcehCity = 
  | 'Banda Aceh' | 'Sabang' | 'Lhokseumawe' | 'Langsa' | 'Meulaboh'
  | 'Bireuen' | 'Takengon' | 'Blangpidie' | 'Calang' | 'Jantho'
  | 'Sigli' | 'Singkil' | 'Subulussalam' | 'Suka Makmue' | 'Tapaktuan';

  