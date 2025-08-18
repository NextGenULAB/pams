
import Pricing from '@/components/pricing';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PricingPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-start mb-8">
        <Link
          href="/"
          className="flex items-center text-muted-foreground hover:text-white transition-colors duration-300 group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-full mx-auto mb-16 text-center">
        <Badge
          variant="outline"
          className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium mb-6 animate-bounce-in"
        >
          Affordable Healthcare
        </Badge>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          Simple, Transparent Pricing
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          Choose the perfect consultation plan for your needs. No hidden fees, no surprises.
        </p>
      </div>
      
      <div className="animate-fade-in-up" style={{ animationDelay: "600ms" }}>
        <Pricing/>
      </div>

      <div className="max-w-3xl mx-auto mt-20 text-center animate-fade-in-up" style={{ animationDelay: "800ms" }}>
        <Card className="bg-gradient-to-r from-emerald-900/30 to-emerald-950/20 border-emerald-800/20 hover:border-emerald-700/40 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-900/30">
          <CardContent className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Questions? We're here to help!
            </h2>
            <p className="text-muted-foreground mb-6">
              Contact our support team for any inquiries about our plans or services.
            </p>
            <Button 
              asChild
              size="lg"
              className="bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25"
            >
              <Link href="/contact">Contact Support</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PricingPage;