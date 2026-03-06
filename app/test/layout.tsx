// app/(dashboard)/layout.tsx
import "../globals.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}> 
      <body className="bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
