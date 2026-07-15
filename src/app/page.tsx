import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import CountdownStrip from "@/components/CountdownStrip";
import Envelope from "@/components/Envelope";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Portrait from "@/components/Portrait";
import Details from "@/components/Details";
import DressCode from "@/components/DressCode";
import Rsvp from "@/components/RSVP";
import Calendar from "@/components/Calendar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Preloader />
      <Navbar />
      <main className="relative">
        <Envelope />
        <Hero />
        <Story />
        <Portrait />
        <Details />
        <DressCode />
        <Rsvp />
        <Calendar />
        <Footer />
      </main>
      <CountdownStrip />
    </>
  );
}
