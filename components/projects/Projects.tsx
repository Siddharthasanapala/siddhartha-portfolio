import { projects } from "@/data/projects";
import { Badge, Card, Container, Section } from "@/components/ui";

export function Projects() {
  const featured = projects.filter((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);

  return (
    <Section id="projects">
      <Container className="flex flex-col gap-8">
        <h2 className="font-display text-h2 font-bold text-text">Projects</h2>

        {featured.map((project) => (
          <Card key={project.id} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h3 className="font-display text-h3 font-bold text-text">{project.name}</h3>
              <p className="text-body text-text-muted">{project.summary}</p>
            </div>

            <ul className="flex list-disc flex-col gap-1.5 pl-5 text-body text-text-muted">
              {project.highlights.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>

            {project.metrics && project.metrics.length > 0 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {project.metrics.map((metric) => (
                  <div
                    key={metric}
                    className="rounded-lg border border-border bg-bg-elevated-2 px-4 py-3 font-mono text-xs text-accent-2"
                  >
                    {metric}
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <Badge key={item} variant="default">
                  {item}
                </Badge>
              ))}
            </div>
          </Card>
        ))}

        <div className="grid grid-cols-1 gap-5">
          {rest.map((project) => (
            <Card key={project.id} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-h3 font-bold text-text">{project.name}</h3>
                <p className="text-body text-text-muted">{project.summary}</p>
              </div>

              <ol className="flex flex-col gap-3">
                {project.highlights.map((step, index) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-xs font-medium text-on-accent">
                      {index + 1}
                    </span>
                    <span className="text-body text-text-muted">{step}</span>
                  </li>
                ))}
              </ol>

              <div className="flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <Badge key={item} variant="default">
                    {item}
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
