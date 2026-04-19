"use client";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} SmartBus. All rights reserved.
      </div>
    </footer>
  );
}