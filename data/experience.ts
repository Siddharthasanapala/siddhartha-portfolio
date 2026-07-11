import type { ExperienceItem } from "@/types";

export const experience: ExperienceItem[] = [
  {
    id: "sails-trainee-swe",
    role: "Trainee Software Engineer",
    organization: "Sails Software",
    period: "2024 – Present (full-time)",
    highlights: [
      "Implemented cloud-native deployment workflows across AWS and Azure.",
      "Built monitoring dashboards using Prometheus and Grafana (metrics, visualization, alerting).",
      "Integrated DevSecOps scanning (Trivy, Snyk, OWASP ZAP) into CI/CD.",
      "Deployed a production full-stack app (React.js + Python + PostgreSQL) on Azure Web Apps with restricted backend/DB network access.",
      "Diagnosed deployment failures and infra incidents; applied SRE practices.",
    ],
  },
  {
    id: "sails-sre-intern",
    role: "SRE Intern",
    organization: "Sails Software (onsite)",
    period: "2024",
    highlights: [
      "Containerized apps with Docker, deployed to GKE (deployments, services, ingress, HPA via Helm).",
      "Automated infra provisioning with Terraform (IaC).",
      "Refined CI/CD pipelines (Jenkins, Azure DevOps) — build caching, multi-stage Docker builds.",
      "Configured K8s network policies and secure ingress/egress.",
    ],
  },
  {
    id: "brainovision-aws-intern",
    role: "AWS Intern",
    organization: "Brainovision",
    period: "2023",
    highlights: [
      "Implemented EC2, IAM, VPC, S3, ELB, Auto Scaling Groups, ECR.",
      "Explored CloudWatch, Lambda, CI/CD concepts.",
    ],
  },
  {
    id: "jupitos-python-intern",
    role: "Python Developer Intern",
    organization: "Jupitos Technologies LLC",
    period: "2023",
    highlights: [
      "Built modular REST APIs with DRF + JWT auth.",
      "Serializer/viewset/auth modules with RBAC.",
      "10+ backend assignments (auth, CRUD, API design, PostgreSQL).",
    ],
  },
];
