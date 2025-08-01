"use client";

import React, { useEffect, useState } from "react";
import { useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button"; 
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"; 
import { User, Stethoscope, Loader2 } from "lucide-react"; 
import { setUserRole } from "@/actions/onboarding";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SPECIALTIES } from "@/lib/specialities";

const doctorFormSchema = z.object({ 
speciality: z.string().min(1, "speciality is required"),
experience: z
.number()
.min(1, "Experience must be at least 1 year")
.max(70, "Experience must be less than 70 years"),
credentialUrl:z
.string()
.url("Please enter a valid URL")
.min(1, "Credential URL is required"),
description: z
.string()
.min(20, "Description must be at least 20 characters")
.max(1000, "Description cannot exceed 1000 characters"),
})

const OnboardingPage = () => {
    const [step, setStep] = useState("choose-role");
    const router = useRouter()

  const {data, fn: submitUserRole, loading} = useFetch(setUserRole);
    
 const { 
    register,
     handleSubmit,
     formState:{errors},
     setValue,
     watch,
    }= useForm({
    resolver:zodResolver(doctorFormSchema),
    defaultValues:{
        speciality:"",
        experience: undefined,
        credentialUrl: "",
        description:"",
    },
 });

 const specialityValue = watch("speciality");
  
 const handlePatientSelection= async() => {
    if (loading) return;

    const formData = new FormData();
    formData.append("role" , "PATIENT");

    await submitUserRole(formData)
 };

 useEffect(() => {
    if (data && data?.success){
        toast.success("Role Selected!");
        router.push(data.redirect);
    }

 }, [data])
 
 if (step === "choose-role"){ 
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card onClick= {()=> !loading && handlePatientSelection()} className = "border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all">
        
        <CardContent className = "pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
            <User className ="h-8 w-8 text-emerald-400"/>
            </div>
           <CardTitle className= "text-xl font-semibold text-white mb-2">
            Join as a Patient
            </CardTitle>
            <CardDescription className="mb-4">
                Book appointments,consult with doctors, and manage your healthcare journey
            </CardDescription>
            <Button className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                { loading? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing... </>
                     ) : ("Continue as a Patient") }</Button>
        </CardContent>
    </Card> 
    
     <Card
     onClick={()=> !loading && setStep("doctor-form")}
     className = "border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all">
        
        <CardContent className = "pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
            <Stethoscope className ="h-8 w-8 text-emerald-400"/>
            </div>
           <CardTitle className= "text-xl font-semibold text-white mb-2">
            Join as a Doctor
            </CardTitle>
            <CardDescription className="mb-4">
                Create your profession profile, set your availability, and provide consultations
            </CardDescription>
            <Button disabled={loading}
            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700">
                Continue as a Doctors
                </Button>
        </CardContent>
    </Card> 
    </div>
    );
 }
 if (step === "doctor-form"){
    return (
    <Card
     className = "border-emerald-900/20">
        
        <CardContent className = "pt-6">
            <div classname="mb-6">
            
           <CardTitle className= "text-2xl font-bold text-white mb-2">
            Complite Your Profile
            </CardTitle>
            <CardDescription >
                Please provide your professional details and verification
            </CardDescription>
            </div>
            <form className="space-y-6">
                <div className="space-y-2">
            <Label htmlFor="speciality">Medical Speciality</Label>
            <Select>
                <SelectTrigger id="speciality">
                    <SelectValue placeholder="select your speciality" />
                </SelectTrigger>
                <SelectContent>
                    {SPECIALTIES.map((spec)=>{
                    return (<SelectItem
                         key={spec.name}
                        value={spec.name}
                        className="flex items-center gap-2"
                    >
                     <span className="text-emerald-400"> {spec.icon} </span>
                     {spec.name}  
                    </SelectItem>
                    );
                    })}
                   
                   
                </SelectContent>
                </Select>
                </div>

            </form>
        </CardContent>
    </Card>
    );
 }
};

export default  OnboardingPage;
