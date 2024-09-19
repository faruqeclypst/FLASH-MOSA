import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LandingPage from '../components/LandingPage';
import AboutFlash from '../components/AboutFlash';
import FlashActivities from '../components/FlashActivities';
import CompetitionList from '../components/CompetitionList';
import Registration from '../components/Registration';
import Gallery from '../components/Gallery';
import MapLocation from '../components/MapLocation';
// import ContactForm from '../components/ContactForm';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <LandingPage />
        <AboutFlash />
        <FlashActivities />
        <CompetitionList />
        <Registration />
        <Gallery />
        {/* <ContactForm /> */}
      </main>
      <MapLocation />
      <Footer />
    </div>
  );
};

export default Home;