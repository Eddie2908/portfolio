import Head from 'next/head';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Contact from '@/components/sections/Contact';

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact — DevPortfolio</title>
        <meta name="description" content="Contactez-moi pour discuter de votre prochain projet." />
      </Head>
      <Header />
      <main className="pt-20">
        <Contact />
      </main>
      <Footer />
    </>
  );
}
