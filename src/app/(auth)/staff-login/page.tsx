"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function StaffLogin() {
  const router = useRouter();

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      email: "staff@test.com",
      password: "123456",
      loginType: "staff",
      redirect: false,
    });

    if (!res?.error) {
      const session = await fetch("/api/auth/session").then(res => res.json());

      if (session.user.role === "approver") {
        router.push("/dashboard/approver");
      } else {
        router.push("/dashboard/dispatcher");
      }
    }
  };

  return <button onClick={handleLogin}>Staff Login</button>;
}