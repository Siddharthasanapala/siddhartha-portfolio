import { skills } from "@/data/skills";
import { Badge, Card, Container, Section } from "@/components/ui";

export function Skills() {
  return (
    <Section id="skills">
      <Container className="flex flex-col gap-10">
        <h2 className="font-display text-h2 font-bold text-text">Skills</h2>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {skills.map((category) => (
            <Card key={category.id} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-h3 font-bold text-text">{category.title}</h3>
                <p className="text-body text-text-muted">{category.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.tags.map((tag) => (
                  <Badge key={tag} variant="default">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
