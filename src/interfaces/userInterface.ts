export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth?: Date;
  timeOfBirth: string;
  profilePicture?:string
  about?: string;
  country?: string;
  isGoogleUser?: boolean;
  longitude: string;
  latitude: string;
  profilePicture?: string;
  astrologyDetail?: IAstrologyDetail;
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
