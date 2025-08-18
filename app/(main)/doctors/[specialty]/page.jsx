import PageHeader from "@/components/page-header";
import { redirect } from "next/navigation";
import { getDoctorsBySpecialty } from "@/actions/doctors-listing";
import DoctorCard from "@/components/doctor-card";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, Users } from "lucide-react";

const SpecialityPage = async ({ params }) => {
    const { specialty } = await params;

    if (!specialty) {
        redirect("/doctors");
    }

    const { doctors, error } = await getDoctorsBySpecialty(specialty);

    if (error) {
        console.error("Error fetching doctors:", error);
    }

    const specialtyName = specialty.split("%20").join(" ");

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <div className="w-20 h-20 rounded-full bg-emerald-900/20 flex items-center justify-center mx-auto mb-6 animate-fade-in-up">
                    <Stethoscope className="h-10 w-10 text-emerald-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                    {specialtyName} Specialists
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "400ms" }}>
                    Find and book appointments with qualified {specialtyName.toLowerCase()} doctors
                </p>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="flex justify-start mb-8 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
                    <PageHeader 
                        title={specialtyName}
                        backLink="/doctors"
                        backLabel="All Specialties"
                    />
                </div>

                {doctors && doctors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch animate-fade-in-up" style={{ animationDelay: "800ms" }}>
                        {doctors.map((doctor, index) => (
                            <div
                                key={doctor.id}
                                style={{ animationDelay: `${1000 + index * 100}ms` }}
                                className="animate-fade-in-up h-full"
                            >
                                <DoctorCard doctor={doctor} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 animate-fade-in-up" style={{ animationDelay: "800ms" }}>
                        <Card className="max-w-md mx-auto border-emerald-900/20 bg-emerald-950/10">
                            <CardContent className="p-8">
                                <div className="w-16 h-16 rounded-full bg-emerald-900/20 flex items-center justify-center mx-auto mb-4">
                                    <Users className="h-8 w-8 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">
                                    No doctors available
                                </h3>
                                <p className="text-muted-foreground mb-6">
                                    There are currently no verified doctors in this specialty. Please
                                    check back later or choose another specialty.
                                </p>
                                <a 
                                    href="/doctors"
                                    className="text-emerald-400 hover:text-emerald-300 transition-colors duration-300 font-medium"
                                >
                                    Browse All Specialties →
                                </a>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpecialityPage;