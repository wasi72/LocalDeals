import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { getCurrentUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'LocalDeals — Bons plans et réductions authentiques près de chez vous',
  description: 'Découvrez les vraies promotions de vos commerçants et artisans de quartier. Soutenez le commerce local et profitez de réductions exclusives vérifiées.',
  openGraph: {
    title: 'LocalDeals — Bons plans de proximité',
    description: 'Promotions locales exclusives et vérifiées chez vos commerçants de quartier.',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="fr" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        <Navbar
          currentRole={currentUser?.role || 'RESIDENT'}
          userName={currentUser?.name || 'Visiteur'}
          selectedCity="Paris 11e"
        />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
