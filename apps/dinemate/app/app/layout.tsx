
import { Poppins } from "next/font/google";
import "../globals.css";
import type { Metadata, Viewport } from "next";
import Navbar from "~/components/Navbar";
import PageHeader from "~/components/PageHeader";
import StoreMounter from "~/components/home/StoreMounter";
import { Toaster } from "~/components/ui/toaster";
import ToastNotifMounter from "~/components/ToastNotifMounter";
import SessionChecker from "~/components/SessionChecker";

const APP_NAME = "DineMate";
const APP_DEFAULT_TITLE = "DineMate";
const APP_TITLE_TEMPLATE = "%s - DineMate";
const APP_DESCRIPTION = "Digital Restaurant Menu";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], 
});

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <StoreMounter />
        <ToastNotifMounter />
        <SessionChecker />
        <section className='flex flex-col min-h-screen px-5 py-3 '>
          <header className="absolute w-full h-[130px] bg-custom-primary left-0 top-0  text-white">
            <PageHeader/>
          </header>
          <main className='flex-1 z-10'>
            {children}
          </main>
          <Navbar/>
        </section>
        <Toaster />
      </body>
    </html>
  );
}
