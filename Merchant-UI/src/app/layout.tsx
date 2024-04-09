import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider"
import Navbar  from "@/app/NavBar";
import { cn } from "@/lib/utils"
import "./globals.css";


const fontSans = FontSans({ subsets: ["latin"],
variable:  "--font-sans", });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className = {cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable)}>

      <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar></Navbar>
            
            {children}
          </ThemeProvider>
        </body>
    </html>
  );
}
