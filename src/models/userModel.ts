import mongoose from "mongoose";
import { IUser } from "../interfaces/userInterface";

export interface IUserDocument extends IUser, Document {}

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    dateOfBirth:{
        type:Date,

    },
    country:{
        type:String
    },
    about:{
        type:String,
    }
})

const User = mongoose.model<IUserDocument>('User',userSchema)

export default User