import type { SkillCategory } from "@/types";

export const skills: SkillCategory[] = [
  {
    id: "backend-engineering",
    title: "Backend Engineering",
    summary: "Design secure REST APIs, authentication and role-based access.",
    tags: ["Python", "Java", "Django", "Django REST Framework", "REST APIs", "JWT Authentication"],
  },
  {
    id: "cloud-infrastructure",
    title: "Cloud & Infrastructure",
    summary: "Provision infrastructure, networking and identity across cloud providers.",
    tags: ["GCP", "AWS", "Azure (Web Apps)", "Terraform", "Ansible", "VPC/IAM"],
  },
  {
    id: "cicd-devsecops",
    title: "CI/CD & DevSecOps",
    summary: "Automate build, test and deployment pipelines with security built in.",
    tags: [
      "Docker",
      "Kubernetes",
      "Helm",
      "GitHub Actions",
      "Jenkins",
      "Azure DevOps Pipelines",
      "Trivy",
      "Snyk",
      "OWASP ZAP",
    ],
  },
  {
    id: "observability-data",
    title: "Observability & Data",
    summary: "Monitor systems and manage data for reliable operations.",
    tags: [
      "Prometheus",
      "Grafana",
      "Sentry",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Redis",
      "Git",
      "Postman",
      "Swagger",
      "Linux",
    ],
  },
];
