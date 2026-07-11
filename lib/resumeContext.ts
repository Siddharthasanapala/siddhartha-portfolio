import { certifications } from "@/data/certifications";
import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { principles } from "@/data/principles";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { timeline } from "@/data/timeline";

export interface ResumeContext {
  name: string;
  location: string;
  positioning: string;
  principles: { title: string; description: string }[];
  skills: { title: string; summary: string; tags: string[] }[];
  experience: {
    role: string;
    organization: string;
    period: string;
    highlights: string[];
  }[];
  projects: {
    name: string;
    summary: string;
    highlights: string[];
    metrics?: string[];
    stack: string[];
  }[];
  timeline: { period: string; title: string; tags: string[] }[];
  education: {
    institution: string;
    credential: string;
    period: string;
    score: string;
  }[];
  certifications: { name: string; issuer: string; date: string }[];
}

/**
 * Builds RESUME_CONTEXT fresh from the same /data/*.ts used to render the
 * site (chatbot spec §2 implementation note) — never hardcode a stale copy.
 * Deliberately excludes the raw email address: the system prompt already
 * instructs the model to route contact through the chat flow rather than
 * reciting an address.
 */
export function getResumeContext(): ResumeContext {
  return {
    name: profile.name,
    location: profile.location,
    positioning: profile.positioning,
    principles: principles.map(({ title, description }) => ({ title, description })),
    skills: skills.map(({ title, summary, tags }) => ({ title, summary, tags })),
    experience: experience.map(({ role, organization, period, highlights }) => ({
      role,
      organization,
      period,
      highlights,
    })),
    projects: projects.map(({ name, summary, highlights, metrics, stack }) => ({
      name,
      summary,
      highlights,
      metrics,
      stack,
    })),
    timeline: timeline.map(({ period, title, tags }) => ({ period, title, tags })),
    education: education.map(({ institution, credential, period, score }) => ({
      institution,
      credential,
      period,
      score,
    })),
    certifications: certifications.map(({ name, issuer, date }) => ({ name, issuer, date })),
  };
}
