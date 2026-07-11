import { profile } from "@/data/profile";
import { Container } from "@/components/ui";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col items-center gap-4 py-8 text-body text-text-muted sm:flex-row sm:justify-between">
        <p className="font-mono text-xs">{profile.email}</p>
        <SocialLinks />
        <p className="font-mono text-xs">
          © {year} {profile.name}
        </p>
      </Container>
    </footer>
  );
}
