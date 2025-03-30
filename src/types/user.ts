import { Document } from "mongoose";



export interface User extends Document {
    UserName:string,
    Gender:"Male"|"Female"|"Prefer not to say"
    Email:string,
    MobileNumber?:string,
    Password:string,
}