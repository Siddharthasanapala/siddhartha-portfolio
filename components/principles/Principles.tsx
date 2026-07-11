import { Activity, GitBranch, Lock, RefreshCw, ShieldCheck, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { principles } from "@/data/principles";
import { Card, Container, Reveal, Section, StaggerGroup, StaggerItem } from "@/components/ui";

const ICONS: Record<string, LucideIcon> = {
  "automation-first": Zap,
  "reliability-by-design": ShieldCheck,
  "measure-before-optimizing": Activity,
  "secure-by-default": Lock,
  "everything-version-controlled": GitBranch,
  "continuous-improvement": RefreshCw,
};

export function Principles() {
  return (
    <Section id="principles">
      <Container className="flex flex-col gap-10">
        <Reveal>
          <h2 className="font-display text-h2 font-bold text-text">Engineering Principles</h2>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle) => {
            const Icon = ICONS[principle.id];
            return (
              <StaggerItem key={principle.id} className="h-full">
                <Card className="flex h-full flex-col gap-3">
                  {Icon && <Icon size={24} className="text-accent" aria-hidden="true" />}
                  <h3 className="font-display text-h3 font-bold text-text">{principle.title}</h3>
                  <p className="text-body text-text-muted">{principle.description}</p>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Container>
    </Section>
  );
}
