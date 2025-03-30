
import dbConnect from "@/lib/dbConect";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  const { UserName,  MobileNumber, password, email,Gender } =
    await request.json();
  console.log(
    { UserName, MobileNumber, password, email, Gender},
    "👍"
  );
  const hashedPassword = await bcrypt.hash(password, 12);
  const User = {
    UserName,
    MobileNumber: MobileNumber ? MobileNumber : "",
    Password: hashedPassword,
    Email: email,
    Gender
  };
  console.log(User, "🍻");
  try {
    const userExists = await UserModel.findOne({ Email: email });

    if (userExists) {
      throw new Error("User already exists");
    }

    const newUser = await UserModel.create(User);

    return Response.json(
      {
        success: true,
        message: "User Registered Successfully",
        newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in creating User", error);
    return Response.json(
      {
        success: false,
        message: "Error in creating the user",
        error,
      },
      { status: 500 }
    );
  }
}
