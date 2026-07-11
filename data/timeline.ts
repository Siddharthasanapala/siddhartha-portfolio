import type { TimelineEntry } from "@/types";

export const timeline: TimelineEntry[] = [
  {
    id: "backend-foundations",
    period: "2023",
    title: "Backend Foundations",
    tags: ["Python", "Django", "DRF", "PostgreSQL", "JWT"],
  },
  {
    id: "cloud-fundamentals",
    period: "2023",
    title: "Cloud Fundamentals",
    tags: ["AWS: EC2", "S3", "VPC", "IAM", "CloudWatch"],
  },
  {
    id: "infrastructure-automation",
    period: "2024",
    title: "Infrastructure Automation",
    tags: ["Docker", "Kubernetes", "Helm", "Terraform", "Jenkins", "Ansible"],
  },
  {
    id: "site-reliability-multi-cloud",
    period: "2024–2025",
    title: "Site Reliability & Multi-Cloud",
    tags: ["GCP", "Azure", "Prometheus", "Grafana", "SRE practices"],
  },
  {
    id: "platform-engineering-devsecops",
    period: "2025–2026",
    title: "Platform Engineering & DevSecOps",
    tags: ["Trivy", "Snyk", "OWASP ZAP", "Sentry", "CI/CD at scale"],
  },
];
