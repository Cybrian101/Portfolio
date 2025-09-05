import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Mohammed Ayaan | AI Engineer & Cybersecurity Specialist",
  description:
    "The personal portfolio of Mohammed Ayaan, showcasing projects in Generative AI and expertise in Cybersecurity.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${poppins.className} min-h-screen w-full overflow-x-hidden bg-slate-900 text-slate-300`}
      >
        {children}
      </body>
    </html>
  );
}
