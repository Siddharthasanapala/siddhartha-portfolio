import type { ExperienceItem } from "@/types";

export const experience: ExperienceItem[] = [
  {
    id: "sails-trainee-swe",
    role: "Trainee Software Engineer",
    organization: "Sails Software",
    period: "2024 – Present (full-time)",
    highlights: [
      "Implemented cloud-native deployment workflows across AWS and Azure environments, supporting application hosting, infrastructure management, and operational reliability.",
      "Built monitoring dashboards using Prometheus and Grafana by configuring metrics collection, visualization, and alerting to improve system observability.",
      "Integrated DevSecOps security scanning into CI/CD workflows using Trivy, Snyk and OWASP ZAP, improving deployment quality through automated vulnerability detection.",
      "Diagnosed deployment failures, application issues and infrastructure incidents across cloud environments by collaborating with development and operations teams.",
      "Deployed a production-ready full-stack application consisting of React.js frontend, Python backend and PostgreSQL database using Azure Web Apps.",
      "Configured secure network access by exposing only frontend endpoints publicly while restricting backend and database communication using Azure networking policies.",
      "Managed application deployment lifecycle including configuration updates, runtime troubleshooting and production maintenance across cloud environments.",
      "Applied SRE operational practices including monitoring, debugging and incident resolution to improve application reliability.",
    ],
  },
  {
    id: "sails-sre-intern",
    role: "SRE Intern",
    organization: "Sails Software (onsite)",
    period: "2024",
    highlights: [
      "Containerized applications using Docker and deployed them onto Google Kubernetes Engine (GKE), managing deployments, services, ingress resources, rolling updates, and environment-specific configurations using Helm.",
      "Automated infrastructure provisioning using Terraform following Infrastructure as Code (IaC) principles, enabling repeatable and consistent cloud resource deployments across environments.",
      "Designed and refined CI/CD pipelines using Jenkins and Azure DevOps Pipelines by introducing build caching, optimizing deployment workflows, and implementing multi-stage Docker builds to reduce image size and improve deployment efficiency.",
      "Improved application availability and scalability by configuring Kubernetes LoadBalancer/Ingress resources, implementing Horizontal Pod Autoscaling (HPA), and tuning deployment strategies for varying workloads.",
      "Strengthened cluster security by applying Kubernetes network policies and secure ingress/egress traffic controls, ensuring controlled communication between application components.",
      "Collaborated through Git-based workflows to troubleshoot deployment failures, container runtime issues, networking problems, and infrastructure-related incidents during real-world project execution.",
    ],
  },
  {
    id: "brainovision-aws-intern",
    role: "AWS Intern",
    organization: "Brainovision",
    period: "2023",
    highlights: [
      "Implemented AWS infrastructure components including EC2, IAM, VPC, S3, RDS, ELB, Auto Scaling Groups and ECR through practical cloud deployment exercises.",
      "Explored CloudWatch monitoring, AWS Lambda and CI/CD concepts to understand scalable cloud infrastructure and operational workflows.",
      "Performed hands-on configuration of networking, identity management and compute resources while following AWS architectural best practices.",
    ],
  },
  {
    id: "jupitos-python-intern",
    role: "Python Developer Intern",
    organization: "Jupitos Technologies LLC",
    period: "2023",
    highlights: [
      "Developed modular REST APIs using Django REST Framework with JWT authentication following secure backend design practices.",
      "Built serializer, viewset and authentication modules supporting role-based user management and secure API access.",
      "Completed 10+ backend development assignments covering authentication, CRUD operations, API design and database integration using PostgreSQL.",
    ],
  },
];
