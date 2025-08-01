"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function verifyDoctor(){
    const { userID } = await auth();

    if (!userID) {
        return false;
    }

    try {
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userID,
            },
            });

            return user?.role === "ADMIN";
         } catch (error) {
            console.error("Error verifying admin:", error);
            return false;
        
    }
}

export async function getPendingDoctors(){
    const isAdmin = await verifyAdmin();
    if (!isAdmin) throw new Error("Unauthorized");

    try {
        const pendingDoctors = await db.user.findMany({
            where: {
                role: "DOCTOR",
                verificationStatus: "PENDING",  
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return { doctors: pendingDoctors };
    } catch (error) {
        throw new Error("Failed to fetch pending doctors");
    }
}


export async function getVerifiedDoctors() {
    const isAdmin = await verifyDoctor();
    if (!isAdmin) throw new Error("Unauthorized");

    try {
        const verifiedDoctors = await db.user.findMany({
            where: {
                role: "DOCTOR",
                verificationStatus: "VERIFIED",  
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return { doctors: verifiedDoctors };
    } catch (error) {
        throw new Error("Failed to fetch verified doctors");
    }
}


export async function updateDoctorStatus(formData) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) throw new Error("Unauthorized");

    const doctorId = formData.get("doctorId");
    const status = formData.get("status");

    if (!doctorId || !["VERIFIED", "REJECTED"].includes(status)) {
        throw new Error("Invalid doctor ID or status");
    }

    try {
        await db.user.update({
            where: { id: doctorId },
            data: { verificationStatus: status },
        });

        revalidatePath("/admin");
        return { success: true};
    } catch (error) {
        console.error("Error updating doctor status:", error);
        throw new Error(`Failed to update doctor status: ${error.message}`);
    }
}

export async function updatedDoctorActiveStatus(formData) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) throw new Error("Unauthorized");

    const doctorId = formData.get("doctorId");
    const suspend = formData.get("suspend") === "true";

    if (!doctorId) {
        throw new Error("Invalid doctor ID");
    }

    try {
        const status = suspend ? "PENDING" : "VERIFIED";

        await db.user.update({
            where: { id: doctorId },
            data: { verificationStatus: status },
        });

        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        throw new Error(`Failed to update doctor active status: ${error.message}`);
    }
}
