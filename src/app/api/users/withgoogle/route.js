import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

connect();

//register with google
export async function POST(request){
  try {
    const reqBody = await request.json();
    const {googleUser} = reqBody;

    //check if user exists
    const user = await User.findOne({ email: googleUser.email });

    //if user exists
    if(user){
        //create token data
        const tokenData = {
          id: user._id,
          fullName: user.fullName,
          email: user.email
        }
        //create token
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn: "1d"})
        user.password = undefined;
        const response = NextResponse.json({
            message: "Login successful",
            user,
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true, 
        })
        return response;

    } else {
          //if user does not exist
          //hash password
          const salt = await bcryptjs.genSalt(10);
          const hashedPassword = await bcryptjs.hash(googleUser.id, salt);
          console.log(googleUser, 'googleUser')
          //create user
          const newUser = new User({
            fullName,
            email,
            password: hashedPassword
          })
          const savedUser = await newUser.save();
          console.log(savedUser);
          savedUser.password = undefined;
          //create token data
          const tokenData = {
            id: user._id,
            fullName: user.fullName,
            email: user.email
          }
          //create token
          const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn: "1d"})

          const response = NextResponse.json({
              message: "User created successfully",
              success: true,
              savedUser
          });

          response.cookies.set("token", token, {
            httpOnly: true, 
          })
          return response;
      }
  } catch (error) {
    return NextResponse.json({error: error.message}, {status: 500});
  }
};