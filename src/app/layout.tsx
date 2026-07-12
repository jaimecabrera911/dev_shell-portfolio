import '../index.css';
import ClientProviders from '../components/ClientProviders';

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
    <html lang="es">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
      </head>
      <body>
        <div id="root">
          <ClientProviders>{children}</ClientProviders>
        </div>
      </body>
    </html>
  );
}
