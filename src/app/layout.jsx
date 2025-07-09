import "./globals.css";
import { Work_Sans } from "next/font/google";

// Configure the font
const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-work-sans",
});

export const metadata = {
  title: "TenTwenty Farms - From Our Farms To Your Hands",
  description:
    "Premium farm products delivered fresh from our farms to your hands",
};

export default function RootLayout({children}) {
  return (
    <html lang="en" className={workSans.className}>
      <body>{children}</body>
    </html>
  );
}
