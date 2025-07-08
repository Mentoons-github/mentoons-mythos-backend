export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  DOB?: Date;
  about?: string;
  country?:string
}
