import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ladi Kwali — She Shaped Clay. Clay Shaped History.",
  description:
    "An immersive tribute to Ladi Kwali, the most celebrated African potter of the twentieth century.",
  keywords: [
    "Ladi Kwali",
    "Nigerian pottery",
    "Gwari",
    "African art",
    "ceramics",
  ],
  openGraph: {
    title: "Ladi Kwali",
    description: "She shaped clay. Clay shaped history.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-kiln text-kaolin antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
