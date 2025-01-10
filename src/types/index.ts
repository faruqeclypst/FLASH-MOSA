// src/types/index.ts

export interface FlashEvent {
  title: string;
  heroImage: string;
  heroVideo?: string;
  heroVideoMobile?: string;
  aboutFlash: string;
  aboutImage?: string;
  eventDate: string;
  registrationPeriod: {
    startDate: string;
    endDate: string;
  };
  activities: Activity[];
  competitions: Competition[];
  gallery: string[];
  titleType?: 'text' | 'image';
  titleImage?: string;
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
  requirePassportPhoto?: boolean;
  documentUrl?: string;
  isActive: boolean;
  eventDate?: string;
  registrationFee: number;
  bankAccount?: {
    number: string;
    holder: string;
  };
  whatsappGroups?: {
    category: SchoolCategory;
    url: string;
  }[];
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
  pasPhoto?: string;
  
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
  adminStatus?: 'diterima' | 'ditolak';
  jalur: string;
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
  | 'KOTA BANDA ACEH' | 'KOTA SABANG' | 'KOTA LHOKSEUMAWE' | 'KOTA LANGSA' | 'KOTA SUBULUSSALAM'
  | 'KABUPATEN ACEH BESAR' | 'KABUPATEN PIDIE' | 'KABUPATEN PIDIE JAYA' | 'KABUPATEN BIREUEN'
  | 'KABUPATEN ACEH TENGAH' | 'KABUPATEN BENER MERIAH' | 'KABUPATEN ACEH UTARA'
  | 'KABUPATEN ACEH TIMUR' | 'KABUPATEN ACEH TAMIANG' | 'KABUPATEN ACEH SINGKIL'
  | 'KABUPATEN ACEH JAYA' | 'KABUPATEN ACEH BARAT' | 'KABUPATEN NAGAN RAYA'
  | 'KABUPATEN SIMEULUE' | 'KABUPATEN ACEH BARAT DAYA' | 'KABUPATEN ACEH SELATAN'
  | 'KABUPATEN ACEH TENGGARA' | 'KABUPATEN GAYO LUES' | 'LUAR DAERAH';