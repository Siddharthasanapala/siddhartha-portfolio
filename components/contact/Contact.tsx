import { MapPin } from "lucide-react";
import { profile } from "@/data/profile";
import { Container, Reveal, Section } from "@/components/ui";
import { OpenChatButton } from "./OpenChatButton";
import { SocialLinks } from "./SocialLinks";

export function Contact() {
  return (
    <Section id="contact">
      <Container>
        <Reveal className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-h2 font-bold text-text">
              Interested in Platform Engineering, DevOps, Cloud Infrastructure, Backend
              Engineering or Site Reliability? Let&rsquo;s build reliable software together.
            </h2>
          </div>

          <div className="flex flex-col gap-3 text-body text-text-muted">
            <p className="font-mono text-text">{profile.email}</p>
            <p className="flex items-center gap-2">
              <MapPin size={16} aria-hidden="true" />
              {profile.location}
            </p>
          </div>

          <SocialLinks />

          <OpenChatButton />
        </Reveal>
      </Container>
    </Section>
  );
}
