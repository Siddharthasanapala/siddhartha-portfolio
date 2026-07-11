import { experience } from "@/data/experience";
import { Container, Reveal, ScrollLineTrack, Section } from "@/components/ui";

export function Experience() {
  return (
    <Section id="experience">
      <Container className="flex flex-col gap-10">
        <Reveal>
          <h2 className="font-display text-h2 font-bold text-text">Experience</h2>
        </Reveal>

        <Reveal>
          <ScrollLineTrack lineClassName="bg-accent">
            <ol className="flex flex-col gap-8 border-l border-border pl-6">
              {experience.map((role) => (
                <li key={role.id} className="relative">
                  <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-bg bg-accent" />
                  <div className="flex flex-col gap-1">
                    <h3 className="font-display text-h3 font-bold text-text">{role.role}</h3>
                    <p className="font-mono text-body text-text-muted">
                      {role.organization} · {role.period}
                    </p>
                  </div>
                  <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-body text-text-muted">
                    {role.highlights.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </ScrollLineTrack>
        </Reveal>
      </Container>
    </Section>
  );
}
