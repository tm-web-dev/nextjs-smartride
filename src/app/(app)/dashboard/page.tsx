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
  <div className="space-y-6">

    {/* Heading */}
    <div>
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <p className="text-muted-foreground mt-1">
        Manage your SmartRide concession card
      </p>
    </div>

    {!application ? (
      <div className="border rounded-2xl p-8 bg-card shadow-sm">

        <div className="flex flex-col items-center text-center">

          <FileText
            size={48}
            className="mb-4 text-muted-foreground"
          />

          <h2 className="text-xl font-semibold">
            No Application Found
          </h2>

          <p className="text-muted-foreground mt-2 mb-6 max-w-md">
            Start your concession card application process.
          </p>

          <Link href="/dashboard/application/apply">
            <Button className="flex gap-2">
              <PlusCircle size={18} />
              Apply Now
            </Button>
          </Link>

        </div>
      </div>
    ) : (
      <div className="grid md:grid-cols-2 gap-6">

        {/* Application Card */}
        <div className="border rounded-2xl p-6 bg-card shadow-sm space-y-4">

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Current Application
            </h2>

            <span
              className={`text-sm font-medium ${getStatusColor(
                application.status
              )}`}
            >
              {application.status}
            </span>
          </div>

          <div className="space-y-2 text-sm">

            <p>
              <span className="font-medium">
                Application No:
              </span>{" "}
              {
                application.applicationNumber
              }
            </p>

            <p>
              <span className="font-medium">
                Submitted:
              </span>{" "}
              {new Date(
                application.createdAt
              ).toLocaleDateString()}
            </p>

            {application.validTill && (
              <p>
                <span className="font-medium">
                  Valid Till:
                </span>{" "}
                {new Date(
                  application.validTill
                ).toLocaleDateString()}
              </p>
            )}

          </div>

          <div className="pt-4 flex gap-3">

            <Button>
              Download PDF
            </Button>

            <Button
              variant="outline"
            >
              Track Status
            </Button>

          </div>

        </div>

      </div>
    )}
  </div>
);
}