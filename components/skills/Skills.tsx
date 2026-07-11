import { skills } from "@/data/skills";
import { Badge, Card, Container, Reveal, Section, StaggerGroup, StaggerItem } from "@/components/ui";

export function Skills() {
  return (
    <Section id="skills">
      <Container className="flex flex-col gap-10">
        <Reveal>
          <h2 className="font-display text-h2 font-bold text-text">Skills</h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {skills.map((category) => (
            <Reveal key={category.id}>
              <Card className="flex h-full flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-h3 font-bold text-text">{category.title}</h3>
                  <p className="text-body text-text-muted">{category.summary}</p>
                </div>
                <StaggerGroup className="flex flex-wrap gap-2" stagger={0.05}>
                  {category.tags.map((tag) => (
                    <StaggerItem key={tag}>
                      <Badge variant="default">{tag}</Badge>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
