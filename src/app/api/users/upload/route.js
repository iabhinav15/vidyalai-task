import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function POST(request) {
  
  try {
    const data = await request.formData();
    const file = data.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded', success:false }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fileName = file.name;

    const userId = await getDataFromToken(request);
    let user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found', success:false }, { status: 404 });
    }
    
    if (!user.files.includes(fileName)) {
      const path = `public/uploads/${fileName}`;
      await writeFile(path, buffer);
      user.files.push(fileName);
      await user.save();
    }

    // const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${fileName}`;
    return NextResponse.json({ message: 'File uploaded successfully', success:true });

  } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
  }

}