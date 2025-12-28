import "./globals.css";

export const metadata = {
    title: "Project Portal",
    description: "Project Management Dashboard",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>
        {/* Common layout */}
        <header style={{ padding: 16, borderBottom: "1px solid #ddd" }}>
            <h2>Project Portal</h2>
        </header>

        <main style={{ padding: 20 }}>
            {children}
        </main>
        </body>
        </html>
    );
}
