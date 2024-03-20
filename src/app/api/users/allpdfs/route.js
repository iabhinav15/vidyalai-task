import { NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request) {

  try {
    const userId = await getDataFromToken(request);
    // console.log(userId, "userId");
    let user = await User.findById(userId);

    // console.log(user, "user");
    // const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${fileName}`;

    return NextResponse.json({ allpdf: user?.files, success:true });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

}