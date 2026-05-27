"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, FileText, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await axios.get("/api/application/get");
        setApplication(res.data?.application || null);
      } catch (err) {
        console.log("Error fetching application", err);
        setApplication(null);
      } finally {
        setLoading(false);
      }
    };

    fetchApp();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      case "dispatched":
        return "text-blue-600";
      case "delivered":
        return "text-purple-600";
      default:
        return "text-yellow-600";
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
 
  <div className="flex flex-col w-full py-6 items-center space-y-10">
    {/* Card Section: Added max-w-md to stop it from filling the whole screen */}
    {!application ? (
      <div className="w-full max-w-md border rounded-xl p-6 bg-card shadow-sm flex flex-col items-center">
        <FileText className="mb-4 text-muted-foreground" size={40} />
        <h2 className="text-lg font-semibold text-center">No Application Found</h2>
        <p className="text-sm text-muted-foreground mt-2 mb-6 text-center">
          Create your application to get started
        </p>
        <Link href="/dashboard/application/apply" className="w-full">
          <Button className="w-full flex gap-2 justify-center mt-4">
            <PlusCircle size={18} />
            Apply Now
          </Button>
        </Link>
      </div>
    ) : (
      /* Applied max-w-md here as well */
      <div className="w-full max-w-md border rounded-xl p-6 bg-card shadow-sm text-left space-y-4">
        <h3 className="text-lg font-semibold">Current Application</h3>
        <div className="text-sm text-gray-600">
          Status:{" "}
          <span className={`font-medium ${getStatusColor(application.status)}`}>
            {application.status || "Pending"}
          </span>
        </div>
        {application.createdAt && (
          <p className="text-xs text-gray-400">
            Submitted on: {new Date(application.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>
    )}
  </div>
);
}