"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      email: "admin@test.com",
      password: "123456",
      loginType: "admin",
      redirect: false,
    });

    if (!res?.error) {
      router.push("/dashboard/admin");
    }
  };

  return <button onClick={handleLogin}>Admin Login</button>;
}