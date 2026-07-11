import { profile } from "@/data/profile";
import { Container, Section } from "@/components/ui";
import { HeroBackground } from "./HeroBackground";
import { HeroContent } from "./HeroContent";

export function Hero() {
  return (
    <Section id="home" className="relative overflow-hidden pt-[clamp(96px,14vw,160px)]">
      <HeroBackground />
      <Container className="relative">
        <HeroContent profile={profile} />
      </Container>
    </Section>
  );
}
