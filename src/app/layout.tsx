
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediCare+ | Hospital Management System",
  description:
    "A modern hospital management system for patients, doctors, appointments, pharmacy, laboratory and billing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
