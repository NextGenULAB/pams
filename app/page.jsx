"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { creditBenefits, features, testimonials } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Check, Stethoscope } from "lucide-react"
import Pricing from "@/components/pricing"

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge
                variant="outline"
                className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium animate-bounce-in"
              >
                Healthcare made simple
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                <span className="animate-slide-up block" style={{ animationDelay: "200ms" }}>
                  Connect with doctors <br />
                  {""}
                </span>
                <span className="gradient-title animate-slide-up block" style={{ animationDelay: "400ms" }}>
                  anytime, anywhere
                </span>
              </h1>
              <p
                className="text-muted-foreground text-lg md:text-xl max-w-md animate-fade-in-up"
                style={{ animationDelay: "600ms" }}
              >
                Book appointments, consult via video, and manage your healthcare journey all in one secure platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: "800ms" }}>
                <Button
                  asChild
                  size="lg"
                  className="bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25 group"
                >
                  <Link href={"/onboarding"}>
                    Get Started{" "}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="border-emerald-700/30 hover:bg-muted/80 transition-all duration-300 hover:scale-105"
                >
                  <Link href={"/doctors"}>Find doctors</Link>
                </Button>
              </div>
            </div>
            <div
              className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden animate-float"
              style={{ animationDelay: "1000ms" }}
            >
              <Image
                src="/banner2.png"
                alt="Online  Doctors Consultation Platform"
                fill
                priority
                className="object-cover md:pt-14 rounded-xl transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-500/20 rounded-full animate-pulse-slow"></div>
              <div
                className="absolute -bottom-8 -left-8 w-32 h-32 bg-emerald-400/10 rounded-full animate-pulse-slow"
                style={{ animationDelay: "1.5s" }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-up">How it works! </h2>
            <p
              className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              Our Platform makes healthcare easy.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              return (
                <Card
                  key={index}
                  className="border-emerald-900/20 hover:border-emerald-800/40
            transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-emerald-900/50 group animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardHeader className="pb-2">
                    <div className="bg-emerald-900/20 p-3 rounded-lg w-fit mb-4 group-hover:bg-emerald-800/30 transition-colors duration-300 group-hover:scale-110 transform">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors duration-300">
                      {" "}
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              className="bg-emerald-900/30 border-emerald-700/30 px-4 py-1 
          text-emerald-400 text-sm font-medium mb-4 animate-bounce-in"
            >
              Affordable Healthcare
            </Badge>
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              Consultation Packages{" "}
            </h2>
            <p
              className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "400ms" }}
            >
              Choose the perfect consultation package that fits your healthcare needs.
            </p>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: "600ms" }}>
            {/*Pricing Table*/}
            <Pricing />
            <Card className="mt-12 bg-muted/20 boreder-emerald-900/30 hover:border-emerald-800/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/20">
              <CardHeader>
                <CardTitle
                  className="text-xl font-semibold text-white flex
                 items-center group"
                >
                  <Stethoscope className="h-5 w-5 mr-2 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                  How our credit system works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {creditBenefits.map((benefit, index) => {
                    return (
                      <li
                        key={index}
                        className="flex items-start animate-fade-in-up"
                        style={{ animationDelay: `${800 + index * 100}ms` }}
                      >
                        <div className="mr-3 mt-1 bg-emerald-900/20 p-1 rounded-full hover:bg-emerald-800/30 transition-colors duration-300">
                          <Check className="h-4 w-4 text-emerald-400" />
                        </div>
                        <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: benefit }} />
                      </li>
                    )
                  })}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="bg-emerald-900/30 border-emerald-700/30 px-4 py-1 text-emerald-400 text-sm font-medium mb-4 animate-bounce-in"
            >
              Success Stories
            </Badge>

            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              What Our Users Say
            </h2>
            <p
              className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "400ms" }}
            >
              Hear from patients and doctors who use our platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => {
              return (
                <Card
                  key={index}
                  className="border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-emerald-900/50 group animate-fade-in-up"
                  style={{ animationDelay: `${600 + index * 200}ms` }}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-900/20 flex items-center justify-center mr-4 group-hover:bg-emerald-800/30 transition-colors duration-300 group-hover:scale-110 transform">
                        <span className="text-emerald-400 font-bold">{testimonial.initials}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-emerald-400 transition-colors duration-300">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">&quot;{testimonial.quote}&quot;</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-emerald-900/30 to-emerald-950/20 border-emerald-800/20 hover:border-emerald-700/40 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-900/30 animate-fade-in-up">
            <CardContent className="p-8 md:p-12 lg:p-16 relative overflow-hidden">
              <div className="max-w-2x1 relative z-10">
                <h2
                  className="text-3xl md:text-4xl font-bold text-white mb-6 animate-slide-up"
                  style={{ animationDelay: "200ms" }}
                >
                  Ready to take control of your health?
                </h2>
                <p
                  className="text-lg text-muted-foreground mb-8 animate-fade-in-up"
                  style={{ animationDelay: "400ms" }}
                >
                  Join thousands of users who have simplified their healthcare journey with out platform. Get Started
                  today and experience the future of healthcare.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
                  <Button
                    asChild
                    size="lg"
                    className="bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25 group"
                  >
                    <Link href="/sign-up">
                      Sign Up Now{" "}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-emerald-700/30 hover:bg-muted/80 transition-all duration-300 hover:scale-105 bg-transparent"
                  >
                    <Link href="pricing">View Pricing</Link>
                  </Button>
                </div>
              </div>

              <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-emerald-800/10 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse-slow"></div>

              <div
                className="absolute left-0 bottom-0 w-[200px] h-[200px] bg-emerald-700/10 rounded-full blur-3xl -ml-10 -mb-10 animate-pulse-slow"
                style={{ animationDelay: "1s" }}
              ></div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
