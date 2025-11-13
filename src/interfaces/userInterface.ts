export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth?: Date;
  timeOfBirth: string;
  profilePicture?: string;
  about?: string;
  country?: string;
  isGoogleUser?: boolean;
  longitude: string;
  latitude: string;
  astrologyDetail?: IAstrologyDetail;
  astrologyReports?: AstroReport;
  isBlocked: boolean;
  role: string;
  takeInitialAssessment: boolean;
  intelligenceTypes: string[];
  designation:string
}

export interface AstroReport {
  sun?: AstroSchema | null;
  moon?: AstroSchema | null;
}

export interface AstroSchema {
  report?: Record<string, any>;
  nakshatra?: Record<string, any>;
  zodiac?: string;
  lastGenerated?: Date;
  rasi: {
    id: number;
    name: string;
    lord: {
      id: number;
      name: string;
      vedic_name: string;
    };
  };
}

export interface IAstrologyDetail {
  moonSign?: string;
  sunSign?: string;
}

export interface Google_userInterface {
  id: string;
  displayName: string;
  emails?: { value: string }[];
  photos?: { value: string }[];
}
