import React from "react";
import { verifyAdmin } from "@/actions/admin";
import { redirect } from "next/navigation";
import PageHeader from "@/components/page-header";
import { ShieldCheckIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: "Admin Settings - PAMS",
  description: "manage doctors, parties and platform settings",
};

const AdminLayout = async ({ children }) => {
  const isAdmin = await verifyAdmin();

  if (!isAdmin) {
    redirect("/onboarding");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader icon={<ShieldCheckIcon />} title="Admin Settings" />

      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        {children}
      </Tabs>
    </div>
  );
};

export default AdminLayout;
