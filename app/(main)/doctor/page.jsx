import { getCurrentUser } from '@/actions/onboarding';
import React from 'react'
import { getDoctorAppointments, getDoctorAvailability } from '@/actions/doctor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, DollarSign, Stethoscope } from 'lucide-react';
import AvailabilitySettings from './_components/availability-settings';
import DoctorAppointmentsList from './_components/appoinment-list';
import { getDoctorEarnings, getDoctorPayouts } from "@/actions/payout";
import { DoctorEarnings } from "./_components/doctor-earnings";
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

const DoctorDashboard = async () => {
    const user = await getCurrentUser();

    const [appointmentsData, availabilityData, earningsData, payoutsData] = await Promise.all([
        getDoctorAppointments(),
        getDoctorAvailability(),
        getDoctorEarnings(),
        getDoctorPayouts(),
    ]);

    if (user?.role !== 'DOCTOR') {
        redirect("/onboarding");
    }

    if (user?.verificationStatus !== "VERIFIED") {
        redirect("/doctor/verification");
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
                    Doctor Dashboard
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                    Manage your appointments, availability, and earnings
                </p>
            </div>

            <div className="max-w-6xl mx-auto">
                <Tabs
                    defaultValue="earnings"
                    className="grid grid-cols-1 md:grid-cols-4 gap-6"
                >
                    <TabsList className="md:col-span-1 bg-muted/30 border-emerald-900/20 h-14 md:h-40 flex sm:flex-row md:flex-col w-full p-2 md:p-1 rounded-md md:space-y-2 sm:space-x-2 md:space-x-0 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
                        <TabsTrigger
                            value="earnings"
                            className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all duration-300"
                        >
                            <DollarSign className="h-4 w-4 mr-2 hidden md:inline" />
                            <span>Earnings</span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="appointments"
                            className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all duration-300"
                        >
                            <Calendar className="h-4 w-4 mr-2 hidden md:inline" />
                            <span>Appointments</span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="availability"
                            className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all duration-300"
                        >
                            <Clock className="h-4 w-4 mr-2 hidden md:inline" />
                            <span>Availability</span>
                        </TabsTrigger>
                    </TabsList>

                    <div className="md:col-span-3">
                        <TabsContent value="appointments" className="border-none p-0 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
                            <Card className="border-emerald-900/20 bg-muted/10">
                                <CardContent className="p-6">
                                    <DoctorAppointmentsList 
                                        appointments={appointmentsData.appointments || [] }
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>
                        
                        <TabsContent value="availability" className="border-none p-0 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
                            <Card className="border-emerald-900/20 bg-muted/10">
                                <CardContent className="p-6">
                                    <AvailabilitySettings slots={availabilityData.slots || []} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                        
                        <TabsContent value="earnings" className="border-none p-0 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
                            <Card className="border-emerald-900/20 bg-muted/10">
                                <CardContent className="p-6">
                                    <DoctorEarnings
                                        earnings={earningsData.earnings || {}}
                                        payouts={payoutsData.payouts || []}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
};

export default DoctorDashboard;