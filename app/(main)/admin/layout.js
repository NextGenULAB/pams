import { verifyAdmin } from "@/actions/admin";//adminimport { verifyAdmin } from "@/actions/admin";
import { redirect } from "next/navigation";
import PageHeader from "@/components/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Admin Settings - PAMS",
  description: "manage doctors, parties and platform settings",
};

const AdminLayout = async ({ children }) => {
  const isAdmin = await verifyAdmin();

//  if (!isAdmin) {
//     redirect("/onboarding");
//   }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader icon={<ShieldCheck />} title="Admin Settings" />

      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        { children }
      </Tabs>
    </div>
  );
};

export default AdminLayout;
