import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import FacilitiesSection from "../components/FacilitiesSection";
import MenuSection from "../components/MenuSection";
import GallerySection from "../components/GallerySection";
import TestimonialSection from "../components/TestimonialSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FacilitiesSection />
      <MenuSection />
      <GallerySection />
      <TestimonialSection />
      <ContactSection />
      <Footer />
    </>
  );
}