"use server"

// import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function setAvailabilitySlots(formData) 
{
    const { userId } = await auth;

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try{
        const doctor = db.user.findUnique({
            where: {
                clerkUserId: userId,
                role: "DOCTOR", 
            },
        }); 

        if (!doctor) {
            throw new Error("Doctor not found");
        }
    } catch (error) {}

    } 
