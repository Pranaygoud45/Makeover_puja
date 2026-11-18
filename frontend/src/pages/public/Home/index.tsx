import { useEffect } from 'react';
import HeroSection from './sections/HeroSection';
import BrandIntroSection from './sections/BrandIntroSection';
import ServicesSection from './sections/ServicesSection';
import BridalSection from './sections/BridalSection';
import PortfolioSection from './sections/PortfolioSection';
import WhyChooseSection from './sections/WhyChooseSection';
import SalonExperienceSection from './sections/SalonExperienceSection';
import PackagesSection from './sections/PackagesSection';
import TestimonialsSection from './sections/TestimonialsSection';
import InstagramSection from './sections/InstagramSection';
import AppointmentCTASection from './sections/AppointmentCTASection';

export default function Home() {
  useEffect(() => {
    document.title = 'Pooja Makeover | Your Beauty, Our Art.';
  }, []);

  return (
    <main>
      <HeroSection />
      <BrandIntroSection />
      <ServicesSection />
      <BridalSection />
      <PortfolioSection />
      <WhyChooseSection />
      <SalonExperienceSection />
      <PackagesSection />
      <TestimonialsSection />
      <InstagramSection />
      <AppointmentCTASection />
    </main>
  );
}
