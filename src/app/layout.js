import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  metadataBase: new URL("https://borejak.vercel.app"), 

  title: {
    default: "Borejak – Blood Donation Platform",
    template: "%s | Blood Donation",
  },
  description: "Online blood donation management system",

  icons: {
    icon: "/photo_2025-10-28_11-17-55-removebg-preview.png", 
  },

  openGraph: {
    title: "Borejak – Blood Donation Platform",
    description: "Online blood donation management system",
    siteName: "Blood Donation",
    images: [
      {
        url: "/photo_2025-10-28_11-17-55-removebg-preview.png",
        width: 512,
        height: 512,
        alt: "Blood Donation Logo",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Borejak – Blood Donation Platform",
    description: "Online blood donation management system",
    images: ["/photo_2025-10-28_11-17-55-removebg-preview.png"], 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
