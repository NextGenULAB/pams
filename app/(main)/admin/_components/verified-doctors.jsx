"use client"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { updatedDoctorActiveStatus } from '@/actions/admin';
import useFetch from '@/hooks/use-fetch';
import React, { useState } from 'react'
import { Input } from "@/components/ui/input"; 
import { Search } from "lucide-react";

const VerifiedDoctors = ({doctors}) => {
const [searchTerm, setSearchTerm] = useState ("");
const [targetDoctor, setTargetDoctor] = useState(null);

const filteredDoctors = doctors.filter((doctor) => {
  const query = searchTerm.toLowerCase();
  return (
    doctor.name.toLowerCase().includes(query) ||
    doctor.specialty.toLowerCase().includes(query) ||
    doctor.email.toLowerCase().includes(query)
  );
});

  const {
  loading,
  data,
  fn: submitStatusUpdate,
} = useFetch(updatedDoctorActiveStatus);

  return (
    <div>
      <Card className="bg-muted/20 border-emerald-900/20">
        <CardHeader>
          <div>
            <div>
            <CardTitle className="text-xl font-bold text-white">
             Manage Doctors
          </CardTitle>
          <CardDescription>
             View and manage all verified doctors
          </CardDescription>
        </div>
        <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search doctors..."
              className="pl-8 bg-background border-emerald-900/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
 
</Card>
    </div>
  );
};

export default VerifiedDoctors ;