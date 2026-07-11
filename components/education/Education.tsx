import { education } from "@/data/education";
import { Card, Container, Reveal, Section } from "@/components/ui";
import { Certifications } from "./Certifications";

export function Education() {
  return (
    <Section id="education">
      <Container className="flex flex-col gap-10">
        <Reveal>
          <h2 className="font-display text-h2 font-bold text-text">Education</h2>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {education.map((item) => (
              <Card key={item.id} className="flex flex-col gap-2">
                <h3 className="font-display text-h3 font-bold text-text">{item.institution}</h3>
                <p className="text-body text-text-muted">{item.credential}</p>
                <p className="font-mono text-xs text-text-muted">{item.period}</p>
                <p className="font-mono text-xs text-accent">{item.score}</p>
              </Card>
            ))}
          </div>
        </Reveal>

        <Certifications />
      </Container>
    </Section>
  );
}
