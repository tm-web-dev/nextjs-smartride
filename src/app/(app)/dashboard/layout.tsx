import Sidebar from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // min-h-screen here ensures the whole app is at least viewport height
    <div className="flex h-auto min-h-screen min-w-screen bg-background text-foreground">
      
      <aside className="w-[40%] min-w-125 px-6 border-r">
        <Sidebar />
      </aside>

      {/* Main Area: flex-1 makes this fill all remaining width */}
      <div className=" flex-col align-items-center bg-card justify-center flex-1 w-full">
        
        {/* main: flex-1 here makes it fill the remaining height for vertical centering */}
        <main className="flex-1 flex justify-center items-center px-6">
          <div className="w-full flex flex-col items-center justify-center">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
