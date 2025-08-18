import { TabsContent } from "@/components/ui/tabs";
import { getPendingPayouts, getPendingDoctors, getVerifiedDoctors } from "@/actions/admin";
import VerifiedDoctors from "./_components/verified-doctors";
import PendingDoctors from "./_components/pending-doctors";
import { PendingPayouts } from "./_components/pending-payouts";
import RatingsManagement from "./_components/ratings-management";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, DollarSign, Star } from "lucide-react";

const AdminPage = async () => {
  const [pendingDoctorsData, verifiedDoctorsData, pendingPayoutsData] = await Promise.all([
    getPendingDoctors(),
    getVerifiedDoctors(),
    getPendingPayouts(),
  ]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          Manage doctors, payouts, and platform operations
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-emerald-900/20 bg-emerald-950/10 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-900/20 flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {pendingDoctorsData.doctors?.length || 0}
              </h3>
              <p className="text-muted-foreground">Pending Doctors</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-900/20 bg-emerald-950/10 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-900/20 flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {verifiedDoctorsData.doctors?.length || 0}
              </h3>
              <p className="text-muted-foreground">Verified Doctors</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-900/20 bg-emerald-950/10 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-900/20 flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {pendingPayoutsData.payouts?.length || 0}
              </h3>
              <p className="text-muted-foreground">Pending Payouts</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-900/20 bg-emerald-950/10 animate-fade-in-up" style={{ animationDelay: "700ms" }}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-900/20 flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">∞</h3>
              <p className="text-muted-foreground">Ratings</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <TabsContent value="pending" className="border-none p-0 animate-fade-in-up" style={{ animationDelay: "800ms" }}>
            <Card className="border-emerald-900/20 bg-muted/10">
              <CardContent className="p-6">
                <PendingDoctors doctors={pendingDoctorsData.doctors || []} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="doctors" className="border-none p-0 animate-fade-in-up" style={{ animationDelay: "900ms" }}>
            <Card className="border-emerald-900/20 bg-muted/10">
              <CardContent className="p-6">
                <VerifiedDoctors doctors={verifiedDoctorsData.doctors || []} />
              </CardContent>
            </Card>
          </TabsContent> 
          
          <TabsContent value="payouts" className="border-none p-0 animate-fade-in-up" style={{ animationDelay: "1000ms" }}>
            <Card className="border-emerald-900/20 bg-muted/10">
              <CardContent className="p-6">
                <PendingPayouts payouts={pendingPayoutsData.payouts || []} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ratings" className="border-none p-0 animate-fade-in-up" style={{ animationDelay: "1100ms" }}>
            <Card className="border-emerald-900/20 bg-muted/10">
              <CardContent className="p-6">
                <RatingsManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
