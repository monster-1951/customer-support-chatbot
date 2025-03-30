export interface session {
    expires:string,
    user:sessionUser
}
export interface sessionUser{
    _id:string,
    Email:string,
    FullName:string,
    MobileNumber:string,
    UserName:string,
    ProfilePicture:string | undefined,
}