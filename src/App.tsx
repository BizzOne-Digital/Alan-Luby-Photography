import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { PageMeta } from './components/PageMeta';
import { Splash } from './components/Splash';
import { ScrollProgress } from './components/Motion';
import { MotionConfig, motion } from 'motion/react';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { WorkPage } from './pages/WorkPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { ContactPage } from './pages/ContactPage';
import { PageKey } from './site/content';
import { SiteProvider, useSite } from './site/SiteProvider';

// The admin area is a separate bundle: public visitors never download it.
const AdminApp = lazy(() => import('./admin/AdminApp'));

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

/** Pages taken offline in the admin answer like any missing page. */
const Published: React.FC<{ page: PageKey; children: React.ReactNode }> = ({ page, children }) =>
  useSite().page(page).published ? <>{children}</> : <NotFoundPage />;

/** Old /portfolio links (including ?category=) land on /work. */
const PortfolioRedirect = () => <Navigate to={{ pathname: '/work', search: useLocation().search }} replace />;

/** Each route fades and rises in; keyed by path so it replays on navigation. */
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  return (
    <motion.div key={pathname} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
};

const PublicSite: React.FC = () => (
  <>
    {/* Outside the provider so the intro plays while content loads */}
    <Splash />
    <SiteProvider>
      <ScrollProgress />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main" className="flex-grow">
          <PageTransition>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<Published page="about"><AboutPage /></Published>} />
              <Route path="/services" element={<Published page="services"><ServicesPage /></Published>} />
              <Route path="/work" element={<Published page="work"><WorkPage /></Published>} />
              <Route path="/portfolio" element={<PortfolioRedirect />} />
              <Route path="/testimonials" element={<Published page="testimonials"><TestimonialsPage /></Published>} />
              <Route path="/contact" element={<Published page="contact"><ContactPage /></Published>} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            </PageTransition>
        </main>
        <Footer />
      </div>
    </SiteProvider>
  </>
);

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<div className="min-h-screen bg-paper" aria-busy="true" />}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route path="*" element={<PublicSite />} />
      </Routes>
    </BrowserRouter>
    </MotionConfig>
  );
}
