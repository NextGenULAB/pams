import React from "react";
import { Card, CardContent } from "@/components/ui/card"; 
import Link from "next/link";
import { SPECIALTIES } from "@/lib/specialities";

const SpecialitiesPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
          Find Your Doctor
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          Browse by specialty or view all available healthcare providers
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {SPECIALTIES.map((specialty, index) => (
          <Link key={specialty.name} href={`/doctors/${specialty.name}`}>
            <Card 
              className="hover:border-emerald-700/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-emerald-900/50 cursor-pointer border-emerald-900/20 h-full group animate-fade-in-up"
              style={{ animationDelay: `${400 + index * 100}ms` }}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-emerald-900/20 flex items-center justify-center mb-4 group-hover:bg-emerald-800/30 transition-all duration-300 group-hover:scale-110 transform">
                  <div className="text-emerald-400 text-2xl">
                    {specialty.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors duration-300">
                  {specialty.name}
                </h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialitiesPage;