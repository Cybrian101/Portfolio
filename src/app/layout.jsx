import { Poppins } from "next/font/google";
import "./globals.css";

// Configure the Poppins font
const poppins = Poppins({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: "Mohammed Ayaan | AI Engineer & Cybersecurity Specialist",
  description: "The personal portfolio of Mohammed Ayaan, showcasing projects in Generative AI and expertise in Cybersecurity.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={poppins.className}>
        {children}
      </body>
    </html>
  );
}