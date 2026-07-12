import '../index.css';

export const metadata = {
  title: 'JaiCab | Fullstack Developer',
  description: 'High-performance, technical, and sophisticated portfolio website for a Fullstack Developer.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
