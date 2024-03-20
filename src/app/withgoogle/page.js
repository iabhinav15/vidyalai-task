/*This page is for getting google user and send user info to backend and this page will show only loading screen*/
"use client";

import React, { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import Loading from '../components/Loading';

const GoogleRedirect = () => {

  //get code from url
  const searchParam = useSearchParams(); 
  const code = searchParam.get("code");

  const router = useRouter();

  
  useEffect(() => {
    const googleOAuthHandler = async () => {
        const url = "https://oauth2.googleapis.com/token";
        const values = {
            code,
            client_id: process.env.NEXT_APP_GOOGLE_CLIENT_ID,
            client_secret: process.env.NEXT_APP_GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.NEXT_APP_googleOAuthRedirectURL,
            grant_type: "authorization_code",
        }
  
        const respData = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(values)
        })
        const data = await respData.json();
  
        const { access_token, id_token } = data;
  
        // const { data: googleUser } = await axios.get(
        //     `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, //access_token to get user info
        //     {
        //         headers: {
        //             Authorization: `Bearer ${id_token}`,//id_token to verify who we are
        //         },
        //     });
        const googleUserResp = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
          headers: {
            Authorization: `Bearer ${id_token}`,
          }
        })
        const googleUser = await googleUserResp.json();
        
        //send user info to backend
        // const resp = await axios.post(
        //   `${process.env.NEXT_PUBLIC_API_URL}/auth/data/google`,
        //   { googleUser },
        //   {  withCredentials: true }
        //   );
        //   console.log("resp", resp)
        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/withgoogle`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({googleUser})
        })
        const respJson = await resp.json();
        console.log("respJson", respJson)
        if(respJson.success === true){
          router.push('/');
          
        } else{
          router.push('/login');
        }
    }
    // if(code){
    googleOAuthHandler();
    // }
  }, [code, router])

  return (
    <>
    <div className='w-full h-[100vh] bg-bgColor flex items-center justify-center p-6'>
        <div className='bg-primary w-full md:w-1/3 2xl:w-1/4 px-6 py-8 shadow-md rounded-lg'>
            <Loading />
        </div>
      </div>
    </>
  )
}

export default function GoogleRedirectPage() {
  return (
    <Suspense>
      <GoogleRedirect />
    </Suspense>
  )
}