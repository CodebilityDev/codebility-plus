import React, { ReactNode, Suspense } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <Suspense>
          <main>{children}</main>
        </Suspense>
      </body>
    </html>
  );
};

export default RootLayout;
