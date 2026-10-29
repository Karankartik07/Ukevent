import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "MeraIndia UK - Discover Events, Culture & Community",
  description: "Discover events, culture, food, and community across the UK South Asian diaspora.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} font-sans`}>
      <body className="min-h-screen bg-[#faf7f2] text-stone-900 antialiased selection:bg-pink-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
