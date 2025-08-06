//import { CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Medal, User } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DoctorProfile = ({ doctor, availableDays }) => {
  const totalSlots = availableDays.reduce(
    (total, day) => total + day.slots.length,
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:cols-span-1">
        <div className="md:sticky md:top-24"> </div>
        <Card className="border-emerald-900/20">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 bg-emerald-900/20">
                {doctor.image ? (
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-16 w-16  text-emerald-400" />
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-white mb-1">
                Dr. {doctor.name}
              </h2>
              <Badge
                variant="outline"
                className="bg-emerald-900/2 border-emerald-900/30 text-emerald-400 mb-4"
              >
                {doctor.specialty}
              </Badge>
              <div className="flex items-center justify-center mb-2">
                <Medal className="h-4 w-4 text-emerald-400 mr-2" />
                <span className="text-muted-foreground">
                  {doctor.experience} years of experience
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:cols-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">
              About Dr. {doctor.name}
            </CardTitle>
            <CardDescription>{doctor.specialty}</CardDescription>
          </CardHeader>
          <CardContent>{totalSlots > 0 ? <></> : <div></div>}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorProfile;
