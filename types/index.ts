export interface Profile {
  name: string;
  location: string;
  email: string;
  /** Empty until Siddhartha supplies the real URL — must not be fabricated. */
  linkedinUrl: string;
  /** Empty until Siddhartha supplies the real URL — must not be fabricated. */
  githubUrl: string;
  positioning: string;
  greeting: string;
  description: string;
  typingPhrases: string[];
  resumeUrl: string;
  /** Empty until a real headshot is supplied; Hero falls back to an initials avatar. */
  profileImageUrl: string;
}

export interface Principle {
  id: string;
  title: string;
  description: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  summary: string;
  tags: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  highlights: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  featured?: boolean;
  summary: string;
  highlights: string[];
  metrics?: string[];
  stack: string[];
}

export interface TimelineEntry {
  id: string;
  period: string;
  title: string;
  tags: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  credential: string;
  period: string;
  score: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  organization?: string;
  message: string;
}
