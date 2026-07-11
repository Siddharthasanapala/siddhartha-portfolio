import { ExternalLink } from "lucide-react";
import { profile } from "@/data/profile";

/**
 * Renders only the links that actually have a URL — linkedinUrl/githubUrl
 * are empty until Siddhartha supplies them (Build Spec §6.0: do not
 * fabricate). Text labels rather than brand glyphs, since lucide-react
 * no longer ships LinkedIn/GitHub brand icons.
 */
export function SocialLinks({ className = "" }: { className?: string }) {
  if (!profile.linkedinUrl && !profile.githubUrl) {
    return null;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {profile.linkedinUrl && (
        <a
          href={profile.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-text-muted hover:text-text"
        >
          LinkedIn
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      )}
      {profile.githubUrl && (
        <a
          href={profile.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-text-muted hover:text-text"
        >
          GitHub
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}
