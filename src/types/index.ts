export interface FlashEvent {
  title: string;
  heroImage: string;
  aboutFlash: string;
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
    icon?: string;
  }
  
  export interface Registration {
    id: string;
    name: string;
    email: string;
    school: string;
    competition: string;
    status: 'pending' | 'approved' | 'rejected';
  }