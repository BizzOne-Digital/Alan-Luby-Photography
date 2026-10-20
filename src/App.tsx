import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { PageMeta } from './components/PageMeta';
import { Splash } from './components/Splash';
import { ScrollProgress } from './components/Motion';
import { MotionConfig } from 'motion/react';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { WorkPage } from './pages/WorkPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { ContactPage } from './pages/ContactPage';

const NotFoundPage: React.FC = () => (
  <section className="wrap py-24 sm:py-32">
    <PageMeta title="Page not found" description="This page could not be found on the Alan Luby Photography website." />
    <h1 className="text-4xl sm:text-5xl">This page could not be found.</h1>
    <p className="mt-4 max-w-md text-lg text-muted">The link may be out of date. These pages are a good place to continue.</p>
    <div className="mt-8 flex flex-wrap gap-3">
      <Link to="/" className="btn-primary">Go to the homepage</Link>
      <Link to="/work" className="btn-secondary">View work</Link>
    </div>
  </section>
);

/** Old /portfolio links (including ?category=) land on /work. */
const PortfolioRedirect = () => <Navigate to={{ pathname: '/work', search: useLocation().search }} replace />;

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
    <BrowserRouter>
      <ScrollToTop />
      <Splash />
      <ScrollProgress />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main" className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/portfolio" element={<PortfolioRedirect />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
    </MotionConfig>
  );
}
