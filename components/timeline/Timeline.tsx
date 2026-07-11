import { timeline } from "@/data/timeline";
import { Badge, Container, Section } from "@/components/ui";

export function Timeline() {
  return (
    <Section id="timeline">
      <Container className="flex flex-col gap-10">
        <h2 className="font-display text-h2 font-bold text-text">Engineering Timeline</h2>

        <ol className="flex flex-col gap-8 border-l border-border pl-6">
          {timeline.map((entry) => (
            <li key={entry.id} className="relative">
              <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-bg bg-accent-2" />
              <p className="font-mono text-xs text-text-muted">{entry.period}</p>
              <h3 className="font-display text-h3 font-bold text-text">{entry.title}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <Badge key={tag} variant="default">
                    {tag}
                  </Badge>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
