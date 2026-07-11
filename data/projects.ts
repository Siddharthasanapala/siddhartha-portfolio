import type { ProjectItem } from "@/types";

export const projects: ProjectItem[] = [
  {
    id: "raktapraptih",
    name: "RaktaPraptih — Blood Donation Management System",
    featured: true,
    summary:
      "Production Django + DRF backend for secure, API-driven donor/request management.",
    highlights: [
      "Docker-based deployment on Render with automated CI/CD via GitHub Actions",
      "JWT authentication with role-based access control (RBAC) and custom throttling",
      "Sentry error tracking, Locust load testing, and Twilio operational alerts for reliability",
    ],
    metrics: [
      "100+ concurrent users",
      "30% reduction in access-control overhead",
      "95% of environment-related errors eliminated",
      "100% deployment success after fixing Gunicorn/Supabase config issues",
    ],
    stack: [
      "Python",
      "Django",
      "DRF",
      "PostgreSQL",
      "Docker",
      "GitHub Actions",
      "JWT",
      "Render",
      "Supabase",
      "Sentry",
      "Locust",
      "Twilio",
    ],
  },
  {
    id: "cloud-native-cicd-pipeline",
    name: "Cloud-Native CI/CD Pipeline & Infrastructure Automation (GCP + Azure DevOps)",
    summary: "Multi-repo cloud-native architecture spanning GCP and Azure DevOps.",
    highlights: [
      "Azure DevOps pipelines for build, test, containerize, and release",
      "Terraform-provisioned GCP infrastructure (VPC, GKE, artifact registry)",
      "Dev → Stage → Prod approval-gated rollouts",
      "Helm-managed Kubernetes deployments with private-subnet isolation",
    ],
    stack: ["GCP", "Terraform", "Kubernetes (GKE)", "Helm", "Docker", "Azure DevOps"],
  },
];
