import Head from 'next/head';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Testimonials from '@/components/sections/Testimonials';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <>
      <Head>
        <title>DevPortfolio Développeur Full-Stack</title>
        <meta name="description" content="Portfolio de développeur Full-Stack spécialisé en React, Next.js, Python et FastAPI." />
        <meta property="og:title" content="DevPortfolio Développeur Full-Stack" />
        <meta property="og:description" content="Découvrez mes projets et compétences en développement web moderne." />
        <meta property="og:type" content="website" />
      </Head>
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects preview />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
