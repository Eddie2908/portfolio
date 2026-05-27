import Head from 'next/head';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Projects from '@/components/sections/Projects';

export default function ProjectsPage() {
  return (
    <>
      <Head>
        <title>Projets — DevPortfolio</title>
        <meta name="description" content="Découvrez mes réalisations en développement web full-stack." />
      </Head>
      <Header />
      <main className="pt-20">
        <Projects />
      </main>
      <Footer />
    </>
  );
}
