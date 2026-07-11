import { Activity, GitBranch, Lock, RefreshCw, ShieldCheck, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { principles } from "@/data/principles";
import { Card, Container, Section } from "@/components/ui";

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
        <h2 className="font-display text-h2 font-bold text-text">Engineering Principles</h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle) => {
            const Icon = ICONS[principle.id];
            return (
              <Card key={principle.id} className="flex flex-col gap-3">
                {Icon && <Icon size={24} className="text-accent" aria-hidden="true" />}
                <h3 className="font-display text-h3 font-bold text-text">{principle.title}</h3>
                <p className="text-body text-text-muted">{principle.description}</p>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
