import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/authContext/AuthContext";
import ConditionalShell from "@/components/ConditionalShell";

export const metadata: Metadata = {
  title: "Forge — Project Management for Modern Teams",
  description: "A high-performance, multi-tenant project management tool built for modern engineering teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <ConditionalShell>
              {children}
            </ConditionalShell>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
