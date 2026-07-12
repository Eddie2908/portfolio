import Head from 'next/head';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>À propos — DevPortfolio</title>
        <meta name="description" content="Découvrez mon parcours, mes compétences et ma vision du développement web." />
      </Head>
      <Header />
      <main className="pt-20">
        <About />
        <Skills />
      </main>
      <Footer />
    </>
  );
}
