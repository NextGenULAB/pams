import React from 'react'
import { getCurrentUser } from "@/actions/onboarding";
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Onboarding - PAMS',
  description: "Complete your profile to get started with PAMS",
};

const OnboardingLayout = async ({ children }) => {
  const user = await getCurrentUser();

  if (user){
    if(user.role==="PATIENT"){
      redirect("/doctors");
    }else if (user.role === "DOCTOR"){
      if (user.verificationStatus === "VERIFIED"){
        redirect("/doctor");
      }else{
        redirect("/doctor/verification");
      }
    }else if (user.role === "ADMIN"){
      redirect("/admin");
    }
  }

    return (
    <div className='container mx-auto px-4 py-12'>
      <div className='max-w-3xl mx-auto'>
       <div className='text-center mb-10'>
          <h1 className='text -3xl font-bold text-white mb-2 gradient-title'>
            Welcome to PAMS</h1>
          <p>Tell us how you want to use the platform</p>
        </div> 
        
        
        {children}</div>
      </div>
    );   
};


export default OnboardingLayout;