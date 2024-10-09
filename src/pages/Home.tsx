import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LandingPage from '../components/LandingPage';
import AboutFlash from '../components/AboutFlash';
// import FlashActivities from '../components/FlashActivities';
import CompetitionList from '../components/CompetitionList';
import Registration from '../components/Registration';
import Gallery from '../components/Gallery';
import MapLocation from '../components/MapLocation';
import CTASection from '../components/CTASection';
import SocialProof from '../components/SocialProof';
import Reviews from '../components/Reviews';
import WhatsAppButton from '../components/WhatsAppButton';
// import ContactForm from '../components/ContactForm';

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to top on page load/refresh
    window.scrollTo(0, 0);

    // Lock scroll
    document.body.style.overflow = 'hidden';

    // Unlock scroll when loading is complete
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    document.body.style.overflow = 'unset';
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoading={isLoading} />
      <main ref={mainContentRef} className={`flex-grow ${isLoading ? 'overflow-hidden' : ''}`}>
        <LandingPage onLoadingComplete={handleLoadingComplete} />
        {!isLoading && (
          <>
            <AboutFlash />
            <CompetitionList />
        <Gallery />
        <Reviews /> 
        <SocialProof /> 
        <Registration />
        <MapLocation />
        <CTASection />
        {/* <FlashActivities /> */}
        {/* <ContactForm /> */}
        </>
        )}
      </main>
      {!isLoading && (
      <>
      <WhatsAppButton 
      phoneNumber="+6285359907696" 
      message="Halo Flash MOSA! kami tertarik untuk sponsor FLASH"
      />
      <Footer />
     </>
      )}
    </div>
  );
};

export default Home;