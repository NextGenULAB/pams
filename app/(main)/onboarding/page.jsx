"use client";

import React, { useEffect, useState } from "react";
import { useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button"; 
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"; 
import { User, Stethoscope, Loader2, ArrowRight } from "lucide-react"; 
import { setUserRole } from "@/actions/onboarding";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SPECIALTIES } from "@/lib/specialities";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

 }, [data]);

 const OnDoctorSubmit = async (data) => {
    if (loading) return;

    const formData = new FormData();
     formData.append("role", "DOCTOR");
     formData.append("specialty", data.speciality);
     formData.append("experience", data.experience.toString());
     formData.append("credentialUrl", data.credentialUrl);
     formData.append("description", data.description);

     await submitUserRole(formData); 
 };
 
 if (step === "choose-role"){ 
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
                    Choose Your Role
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                    Select how you'd like to use our healthcare platform
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Card 
                    onClick={() => !loading && handlePatientSelection()} 
                    className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-emerald-900/50 group animate-fade-in-up"
                    style={{ animationDelay: "400ms" }}
                >
                    <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                        <div className="p-6 bg-emerald-900/20 rounded-full mb-6 group-hover:bg-emerald-800/30 transition-all duration-300 group-hover:scale-110 transform">
                            <User className="h-10 w-10 text-emerald-400"/>
                        </div>
                        <CardTitle className="text-2xl font-semibold text-white mb-4 group-hover:text-emerald-400 transition-colors duration-300">
                            Join as a Patient
                        </CardTitle>
                        <CardDescription className="mb-6 text-base">
                            Book appointments, consult with doctors, and manage your healthcare journey
                        </CardDescription>
                        <Button 
                            className="w-full bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25 group" 
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                    Processing... 
                                </>
                            ) : (
                                <>
                                    Continue as Patient
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card> 
                
                <Card
                    onClick={() => !loading && setStep("doctor-form")}
                    className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-emerald-900/50 group animate-fade-in-up"
                    style={{ animationDelay: "600ms" }}
                >
                    <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                        <div className="p-6 bg-emerald-900/20 rounded-full mb-6 group-hover:bg-emerald-800/30 transition-all duration-300 group-hover:scale-110 transform">
                            <Stethoscope className="h-10 w-10 text-emerald-400"/>
                        </div>
                        <CardTitle className="text-2xl font-semibold text-white mb-4 group-hover:text-emerald-400 transition-colors duration-300">
                            Join as a Doctor
                        </CardTitle>
                        <CardDescription className="mb-6 text-base">
                            Create your professional profile, set your availability, and provide consultations
                        </CardDescription>
                        <Button 
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25 group"
                        >
                            Continue as Doctor
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                    </CardContent>
                </Card> 
            </div>
        </div>
    );
 }
 
 if (step === "doctor-form"){
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-up">
                        Complete Your Profile
                    </h1>
                    <p className="text-muted-foreground text-lg animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                        Please provide your professional details for verification
                    </p>
                </div>
                
                <Card className="border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/20 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
                    <CardContent className="pt-8">
                        <form className="space-y-6" onSubmit={handleSubmit(OnDoctorSubmit)}>
                            <div className="space-y-2">
                                <Label htmlFor="speciality" className="text-white font-medium">Medical Specialty</Label>
                                <Select 
                                    value={specialityValue}
                                    onValueChange={(value) => setValue("speciality", value)}
                                >
                                    <SelectTrigger id="speciality" className="border-emerald-900/30 focus:border-emerald-700/50">
                                        <SelectValue placeholder="Select your specialty" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border-emerald-900/30">
                                        {SPECIALTIES.map((spec) => {
                                            return (
                                                <SelectItem
                                                    key={spec.name}
                                                    value={spec.name}
                                                    label={spec.name}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-emerald-400">{spec.icon}</span>
                                                        {spec.name}  
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                {errors.speciality && (
                                    <p className="text-sm font-medium text-red-500 mt-1">
                                        {errors.speciality.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="experience" className="text-white font-medium">Years of Experience</Label>
                                <Input 
                                    id="experience" 
                                    type="number" 
                                    placeholder="e.g. 5"
                                    className="border-emerald-900/30 focus:border-emerald-700/50"
                                    {...register("experience", {valueAsNumber: true})}
                                />
                                {errors.experience && (
                                    <p className="text-sm font-medium text-red-500 mt-1">
                                        {errors.experience.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="credentialUrl" className="text-white font-medium">Link to Credential Documents</Label>
                                <Input 
                                    id="credentialUrl" 
                                    type="url" 
                                    placeholder="https://example.com/medical-degree.pdf"
                                    className="border-emerald-900/30 focus:border-emerald-700/50"
                                    {...register("credentialUrl")}
                                />
                                {errors.credentialUrl && (
                                    <p className="text-sm font-medium text-red-500 mt-1">
                                        {errors.credentialUrl.message}
                                    </p>
                                )}
                                <p className="text-sm text-muted-foreground">
                                    Please provide a link to your medical degree or certification
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-white font-medium">Description of Your Services</Label>
                                <Textarea 
                                    id="description" 
                                    placeholder="Describe your expertise, services, and approach towards patient care"
                                    rows="6"
                                    className="border-emerald-900/30 focus:border-emerald-700/50"
                                    {...register("description")}
                                />
                                {errors.description && (
                                    <p className="text-sm font-medium text-red-500 mt-1">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep("choose-role")}
                                    className="border-emerald-900/30 hover:bg-muted/80 transition-all duration-300"
                                    disabled={loading}
                                >
                                    Back
                                </Button>

                                <Button 
                                    type="submit"
                                    className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25 group"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                            Submitting... 
                                        </>
                                    ) : (
                                        <>
                                            Submit for Verification
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
 }
};

export default OnboardingPage;
