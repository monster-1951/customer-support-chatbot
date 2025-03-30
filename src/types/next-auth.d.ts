import "next-auth";

declare module "next-auth" {
  interface User {
    _id: string;
    UserName: string;
    Email: string;
    MobileNumber?: string;
    Gender:string
  }
  interface Session {
    user: {
      _id: string;
      UserName: string;
      FullName: string;
      Email: string;
      MobileNumber?: string;
      ProfilePicture?: string;
      DateOfBirth?:string;
      Gender:string;
    } & DefaultSession["user"];
  }
  interface JWT {
    _id: string;
    UserName: string;
    Email: string;
    MobileNumber?: string;
    Gender:string,
  }
}
