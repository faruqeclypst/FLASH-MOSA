// src/types/index.ts

export interface FlashEvent {
  title: string;
  heroImage: string;
  heroVideo?: string;
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
  categories?: SchoolCategory[];
}

export interface Registration {
  id?: string;
  registrationCode: string;
  registrationDate: string;
  competition: string;
  status: 'pending' | 'approved' | 'rejected';
  whatsapp: string;
  email: string;
  city: AcehCity;
  ktsSuratAktif?: string;
  buktiPembayaran: string;
  
  // Fields for individual competition
  name?: string;
  gender?: 'Laki-laki' | 'Perempuan';
  birthDate?: string;
  
  // Fields for team competition
  registrantName?: string;
  teamName?: string;
  teamMembers?: string[];
  
  // Common fields
  schoolCategory: SchoolCategory;
  school?: string;
}

export interface DashboardStats {
  totalRegistrations: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
  rejectedRegistrations: number;
  sdMiRegistrations: number;
  smpMtsRegistrations: number;
  smaSmkMaRegistrations: number;
  umumRegistrations: number;
}

export interface School {
  name: string;
  category: SchoolCategory;
}

export interface City {
  name: AcehCity;
}

export type SchoolCategory = 'SD/MI' | 'SMP/MTs' | 'SMA/SMK/MA' | 'UMUM';

export type AcehCity = 
  | 'Banda Aceh' | 'Sabang' | 'Lhokseumawe' | 'Langsa' | 'Meulaboh'
  | 'Bireuen' | 'Takengon' | 'Blangpidie' | 'Calang' | 'Jantho'
  | 'Sigli' | 'Singkil' | 'Subulussalam' | 'Suka Makmue' | 'Tapaktuan';