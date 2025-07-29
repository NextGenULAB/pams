import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="bg-background"> 
      <section cclassName="realtive overflow-hidden py-32">
        <div className="container max-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
           <div>
            <Badge variant="outline"
            className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm front-medium"
            >
            Healthcare made simple
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Connect with doctors <br/>{""}
              <span className="gradient-title">anytime, anywhere</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-md">
                Book appointments, consult via video, and manage your healthcare journey all un one secure platform.
              </p>
              <div>
             <Button>Get Started<</Button>
              </div>
           </div>
            <div></div>
          </div>  
        </div>
        </section>     
    </div>
  );
}
  