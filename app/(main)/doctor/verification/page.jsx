import React from "react";
import { getCurrentUser } from "@/actions/onboarding";
import { redirect } from "next/navigation";
import { ClipboardCheck, XCircle, AlertCircle, Home } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link"; 
import { Button } from "@/components/ui/button";

const VerificationPage = async () => {
  const user = await getCurrentUser();

  if (user?.verificationStatus === "VERIFIED") {
    redirect("/doctor");
  }

  const isRejected = user?.verificationStatus === "REJECTED";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
          Account Verification
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          {isRejected ? "Your application needs revision" : "Your profile is under review"}
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/20 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <CardHeader className="text-center">
            <div
              className={`mx-auto p-6 ${
                isRejected ? "bg-red-900/20" : "bg-amber-900/20"
              } rounded-full mb-6 w-fit transition-all duration-300 hover:scale-110`}
            >
              {isRejected ? (
                <XCircle className="h-12 w-12 text-red-400" />
              ) : (
                <ClipboardCheck className="h-12 w-12 text-amber-400" />
              )}
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-3">
              {isRejected
                ? "Verification Declined"
                : "Verification in Progress"}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              {isRejected
                ? "Unfortunately, your application needs revision."
                : "Thank you for submitting your information."}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {isRejected ? (
              <div className="bg-red-900/10 border border-red-900/20 p-6 rounded-lg flex items-start animate-fade-in-up" style={{ animationDelay: "600ms" }}>
                <AlertCircle className="h-6 w-6 text-red-400 mr-4 mt-1 flex-shrink-0" />
                <div className="text-muted-foreground text-left">
                  <p className="mb-4 font-medium">
                    Our administrative team has reviewed your application and
                    found that it doesn't meet our current requirements.
                    Common reasons for rejection include:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li>Insufficient or unclear credential documentation</li>
                    <li>Professional experience requirements not met</li>
                    <li>Incomplete or vague service description</li>
                  </ul>
                  <p>
                    You can update your application with more information and
                    resubmit for review.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-amber-900/10 border border-amber-900/20 p-6 rounded-lg flex items-start animate-fade-in-up" style={{ animationDelay: "600ms" }}>
                <AlertCircle className="h-6 w-6 text-amber-400 mr-4 mt-1 flex-shrink-0" />
                <p className="text-muted-foreground text-left">
                  Your profile is currently under review by our administrative
                  team. This process typically takes 1-2 business days.
                  You'll receive an email notification once your account is
                  verified.
                </p>
              </div>
            )}
            
            <p className="text-muted-foreground text-center">
              {isRejected
                ? "You can update your doctor profile and resubmit for verification."
                : "While you wait, you can familiarize yourself with our platform or reach out to our support team if you have any questions."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in-up" style={{ animationDelay: "800ms" }}>
              <Button
                asChild
                variant="outline"
                className="border-emerald-900/30 hover:bg-muted/80 transition-all duration-300 hover:scale-105 group"
              >
                <Link href="/">
                  <Home className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  Return to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerificationPage;
