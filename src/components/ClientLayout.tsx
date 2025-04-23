"use client";

import { useState } from "react";
import Navbar from "@/components/NavBar/NavBar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<null | { imageSrc: string; name: string; email: string }>(null);

  const handleLogin = () => {
    setUser({
      imageSrc: "/user.jpg",
      name: "John Doe",
      email: "johndoe@example.com",
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="relative flex flex-col items-center justify-top w-full h-full max-w-[1440px] overflow-x-clip">
      <Navbar user={user} />
      <div className="flex gap-4 mt-4">
        <button onClick={handleLogin} className="btn">Login</button>
        <button onClick={handleLogout} className="btn">Logout</button>
      </div>
      {children}
    </div>
  );
}