import { SecurityProvider } from '../../context/SecurityContext';

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SecurityProvider>
          {children}
        </SecurityProvider>
      </body>
    </html>
  );
}