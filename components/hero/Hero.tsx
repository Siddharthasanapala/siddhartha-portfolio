import { profile } from "@/data/profile";
import { Button, Container, Section } from "@/components/ui";
import { Avatar } from "./Avatar";

/**
 * The typing-effect cycling through `profile.typingPhrases` is a Phase 3
 * motion task (Build Spec §5 / roadmap Phase 3). For now the first phrase
 * renders statically.
 */
export function Hero() {
  return (
    <Section id="home" className="pt-[clamp(96px,14vw,160px)]">
      <Container className="flex flex-col items-start gap-6">
        <Avatar src={profile.profileImageUrl} name={profile.name} />

        <p className="text-body text-text-muted">{profile.greeting}</p>

        <h1 className="whitespace-nowrap font-display text-h1 font-bold text-text">
          {profile.name}
        </h1>

        <p className="font-mono text-body text-accent">{profile.typingPhrases[0]}</p>

        <p className="max-w-prose text-body text-text-muted">{profile.description}</p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button variant="primary" href="#contact">
            Chat with my AI assistant
          </Button>
          <Button variant="secondary" href={profile.resumeUrl} download>
            Download Résumé
          </Button>
        </div>
      </Container>
    </Section>
  );
}
