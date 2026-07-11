import { Nav } from "@/components/nav/Nav";
import { Hero } from "@/components/hero/Hero";
import { Principles } from "@/components/principles/Principles";
import { Skills } from "@/components/skills/Skills";
import { Experience } from "@/components/experience/Experience";
import { Projects } from "@/components/projects/Projects";
import { Timeline } from "@/components/timeline/Timeline";
import { Education } from "@/components/education/Education";
import { Contact } from "@/components/contact/Contact";
import { Footer } from "@/components/contact/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Principles />
        <Skills />
        <Experience />
        <Projects />
        <Timeline />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
