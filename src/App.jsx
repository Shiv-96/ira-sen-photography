/**
 * App
 * Composes the single-page portfolio: skip link, header, all sections, footer
 * and the optional desktop cursor.
 */
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import Footer from './components/Footer.jsx';
import Gallery from './components/Gallery.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Services from './components/Services.jsx';
import Testimonials from './components/Testimonials.jsx';

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-paper focus:px-5 focus:py-3 focus:text-sm focus:text-ink"
      >
        Skip to content
      </a>

      <Header />

      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <Gallery />
        <About />
        <Services />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
      <CustomCursor />
    </>
  );
}
