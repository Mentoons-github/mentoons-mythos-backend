export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth?: Date;
  about?: string;
  country?:string
}
