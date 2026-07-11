import type { Principle } from "@/types";

export const principles: Principle[] = [
  {
    id: "automation-first",
    title: "Automation First",
    description: "Reduce repetitive work through automation and Infrastructure as Code.",
  },
  {
    id: "reliability-by-design",
    title: "Reliability by Design",
    description: "Build resilient systems using monitoring, redundancy and recovery.",
  },
  {
    id: "measure-before-optimizing",
    title: "Measure Before Optimizing",
    description: "Observability guides engineering decisions (Prometheus, Grafana, Sentry).",
  },
  {
    id: "secure-by-default",
    title: "Secure by Default",
    description: "Security scanning (Trivy, Snyk, OWASP ZAP) integrated into CI/CD, not bolted on.",
  },
  {
    id: "everything-version-controlled",
    title: "Everything Version Controlled",
    description:
      "Infrastructure, deployment, configuration and application code stay reproducible.",
  },
  {
    id: "continuous-improvement",
    title: "Continuous Improvement",
    description: "Every deployment, incident and bug is an opportunity to improve the platform.",
  },
];
