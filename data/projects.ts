import type { ProjectItem } from "@/types";

export const projects: ProjectItem[] = [
  {
    id: "raktapraptih",
    name: "RaktaPraptih — Blood Donation Management System",
    featured: true,
    summary:
      "Production Django + DRF backend for secure, API-driven donor/request management, supporting multiple user types (donors, recipients, admins).",
    highlights: [
      "Built RESTful APIs with DRF, integrating JWT authentication and custom throttling, ensuring secure access and API stability under concurrent load.",
      "Designed role-based authentication with Django, supporting multiple user types (donors, recipients, admins).",
      "Containerized the application with Docker, eliminating environment-related errors across deployments.",
      "Configured CI/CD workflows via GitHub Actions, automating pytest test runs, Bandit security scans, and Render deployment.",
      "Resolved CI/CD pipeline failures and Render 502 errors by restructuring Gunicorn execution and validating the Supabase DATABASE_URL.",
      "Strengthened application reliability by integrating Sentry for real-time error tracking, validating API performance under concurrent workloads using Locust load testing, and automating operational alerts through Twilio.",
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
      "pytest",
      "Bandit",
      "JWT",
      "Render",
      "Supabase",
      "Git",
      "Sentry",
      "Locust",
      "Twilio",
    ],
  },
  {
    id: "cloud-native-cicd-pipeline",
    name: "Cloud-Native CI/CD Pipeline & Infrastructure Automation (GCP + Azure DevOps)",
    summary:
      "Multi-repository cloud-native architecture integrating application, infrastructure, and deployment layers.",
    highlights: [
      "Implemented CI/CD pipelines using Azure DevOps to automate build, testing, containerization, and release processes.",
      "Provisioned scalable infrastructure on GCP using Terraform, including VPC networks, GKE clusters, and artifact registry.",
      "Defined environment-specific deployment workflows (Dev → Stage → Prod) with approval gates for controlled rollouts.",
      "Managed Kubernetes deployments using Helm with rolling update strategies and ingress-based routing.",
      "Secured system architecture by isolating backend services within private subnets and regulating external access.",
    ],
    stack: ["GCP", "Terraform", "Kubernetes (GKE)", "Helm", "Docker", "Azure DevOps"],
  },
];
