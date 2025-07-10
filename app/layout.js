import "./globals.css";
import Wrap from "./wrap";
import { Providers } from "./providers";

export const metadata = {
  title: "Easy Budget",
  description: "Budget tracking app",
  icons: {
    icon: "/Pixel_logo.png",
  },
};



export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen  bg-gradient-to-br from-teal-50 to-white dark:bg-gradient-to-br dark:from-teal-900 dark:to-black ">
        <Providers>
          <Wrap>{children}</Wrap>
        </Providers>
      </body>
    </html>
  );
}
