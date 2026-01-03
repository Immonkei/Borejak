"use client";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
