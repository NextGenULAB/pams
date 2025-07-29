import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { features } from "@/lib/data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-background"> 
      <section className="relative overflow-hidden py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
           <div>
            <Badge variant="outline"
            className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium"
            >
            Healthcare made simple
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Connect with doctors <br/>{""}
              <span className="gradient-title">anytime, anywhere</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-md">
                Book appointments, consult via video, and manage your healthcare journey all in one secure platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
             <Button asChild
             size="lg"
             className="bg-emerald-600 text-white hover:bg-emerald-700">
              
              <Link href={"/onboarding"}>
              Get Started<ArrowRight className="ml-2 h-4 w-4"/>
              </Link>
              </Button>
              <Button asChild
             size="lg"
             className="border-emerald-700/30 hover:bg-muted/80">
              <Link href={"/doctors"}>Find doctors</Link>
              </Button>
              </div>
           </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
             <Image src="/banner2.png"
              alt="Online  Doctors Consultation Platform"
              fill
              priority
              className="object-cover md:pt-14 rounded-xl"
              />
            </div>
          </div>  
        </div>
        </section>

        <section classname="py-20 bg-muted/30">
        <div classname="container mx-auto px-4">
        <div classname="text-center mb-16">
          <h2 classname="text-3xl md:text-4xl font-bold text-white mb-4">
            How it works! </h2>
          <p classname="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our Platform makes healthcare easy.</p>
        </div>
        <div classname= "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index)=>{
            return (
            <Card key = {index} classname="border-emerald-900/20 hover:border-emerald-800/40
            transition-all duration-300"
            >
              <CardHeader classname="pb-2">
                <div classname="bg-emerald-900/20 p-3 rounded-lg w-fit mb-4">
                {feature.icon}</div>
               <CardTitle className="text-xl font-semibold text-white">  {feature.title} 

               </CardTitle>
               </CardHeader>
               <CardContent>
                <p classname="text-muted-foreground">{feature.description}</p>
                </CardContent>
                </Card>
            );

          })}
        </div>
        </div>
        </section> 

        <section classname="py-20">
        <div classname="container mx-auto px-4">
        <div classname="text-center mb-16">
          <Badge classname="bg-emerald-900/30 border-emerald-700/30 px-4 py-1 
          text-emerald-400 text-sm font-medium mb-4">
            Affordable Healthcare
          </Badge>
          <h2 classname="text-3xl md:text-4xl font-bold text-white mb-4">
            Consultation Packages </h2>
          <p classname="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the perfect consultation package that fits your healthcare needs.
            </p>
        </div>
        <div>

          {/*Pricing Table*/}
                <Card className="mt-12 bg-muted/20 boreder-emerald-900/30">
              <CardHeader>
                <CardTitle classname="text-xl font-semibold text-white flex
                 items-center">
                  <Stethoscope classname="h-5 w-5 mr-2 text-emerald-400"/>
                  How our credit system works</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
            
            </Card>
        </div>
        </div>
        </section>   
    </div>
  );
}
  