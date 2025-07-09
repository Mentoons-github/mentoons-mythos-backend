export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  DOB?: Date;
  about?: string;
  country?: string;
  isGoogleUser?: boolean;
}

export interface Google_userInterface {
  id: string;
  displayName: string;
  emails?: { value: string }[];
  photos?: { value: string }[];
}
