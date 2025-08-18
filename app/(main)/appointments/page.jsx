
import { getCurrentUser } from '@/actions/onboarding';
import { getPatientAppointments } from '@/actions/patient';
import PageHeader from '@/components/page-header';
import React from 'react'
import { Calendar, Plus } from "lucide-react";
import AppointmentCard from '@/components/appointment-card';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const PatientAppointmentsPage = async() => {
    const user = await getCurrentUser();

    if (!user || user.role !== "PATIENT") {
        redirect("/onboarding");
    }

    const { appointments, error } = await getPatientAppointments();
    
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
                    My Appointments
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                    Manage your scheduled consultations and healthcare appointments
                </p>
            </div>

            <div className="flex justify-center mb-8 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
                <Button
                    asChild
                    size="lg"
                    className="bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25 group"
                >
                    <Link href="/doctors">
                        <Plus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                        Book New Appointment
                    </Link>
                </Button>
            </div>
            
            {error ? (
                <div className='text-center py-12 animate-fade-in-up' style={{ animationDelay: "600ms" }}>
                    <Card className="max-w-md mx-auto border-red-900/20 bg-red-950/10">
                        <CardContent className="p-6">
                            <p className='text-red-400 font-medium'>Error: {error}</p>
                        </CardContent>
                    </Card>
                </div>
            ) : appointments?.length > 0 ? (
                <div className='space-y-4 max-w-4xl mx-auto animate-fade-in-up' style={{ animationDelay: "600ms" }}>
                    {appointments.map((appointment, index) => (
                        <div
                            key={appointment.id}
                            style={{ animationDelay: `${800 + index * 100}ms` }}
                            className="animate-fade-in-up"
                        >
                            <AppointmentCard
                                appointment={appointment}
                                userRole="PATIENT"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className='text-center py-12 animate-fade-in-up' style={{ animationDelay: "600ms" }}>
                    <Card className="max-w-md mx-auto border-emerald-900/20 bg-emerald-950/10">
                        <CardContent className="p-8">
                            <Calendar className='h-16 w-16 mx-auto text-emerald-400 mb-4'/>
                            <h3 className='text-xl font-semibold text-white mb-3'>
                                No appointments scheduled
                            </h3> 
                            <p className='text-muted-foreground mb-6'>
                                You don't have any appointments scheduled yet. Browse our doctors and book your first consultation.
                            </p>
                            <Button
                                asChild
                                className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 hover:scale-105"
                            >
                                <Link href="/doctors">Find Doctors</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default PatientAppointmentsPage;