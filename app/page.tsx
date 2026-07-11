import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Badge, Button, Card, Container, Section } from "@/components/ui";

/**
 * Phase 1 design-system verification page — swapped out for the real
 * content sections in Phase 2. Exists to visually confirm token/theming
 * and contrast against every color token, per the Phase 1 acceptance
 * criteria in 02-IMPLEMENTATION_ROADMAP.md.
 */
export default function Home() {
  return (
    <Section className="flex-1">
      <Container className="flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <span className="font-mono text-body text-text-muted">Design system preview</span>
          <ThemeToggle />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="whitespace-nowrap font-display text-h1 font-bold">Siddhartha</h1>
          <h2 className="font-display text-h2 font-bold">Section heading</h2>
          <h3 className="font-display text-h3 font-bold">Card heading</h3>
          <p className="max-w-prose text-body text-text">
            Body copy in Inter, rendered against the --text token to confirm contrast on the
            page background.
          </p>
          <p className="max-w-prose text-body text-text-muted">
            Muted secondary text using the --text-muted token, for captions and metadata.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Chat with my AI assistant</Button>
          <Button variant="secondary">Download Résumé</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Docker</Badge>
          <Badge variant="accent">Kubernetes</Badge>
          <Badge variant="warn">DevSecOps</Badge>
        </div>

        <Card className="max-w-md">
          <h3 className="font-display text-h3 font-bold">Card primitive</h3>
          <p className="mt-2 text-body text-text-muted">
            Cards use --bg-elevated with a --border outline and 12px radius.
          </p>
        </Card>
      </Container>
    </Section>
  );
}
