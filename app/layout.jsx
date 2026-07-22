import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "BH Labs",
  description: "BH Labs — virtual programming laboratory",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
