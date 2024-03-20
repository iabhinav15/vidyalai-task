"use client";
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { getGoogleOAuthURL } from '@/helpers/getGoogleOAuthURL';

const LoginwithGoogle = ({type}) => {

  return (
    <div>
      <Link className="inline-flex items-center text-base justify-center rounded-md bg-white px-6 py-2 font-medium text-black outline-none border-[2px] border-solid border-black" href={getGoogleOAuthURL()}>
        {
          type === "Login" ? "Login With Google" : "Signup With Google"
        }
        <Image src="/google-logo.webp" width={100} height={100} className='w-8 h-8 ml-[0.7rem] rounded-[50%] object-cover' alt="" />
      </Link>
    </div>
  )
}

export default LoginwithGoogle



