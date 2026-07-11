import { certifications } from "@/data/certifications";
import { Card } from "@/components/ui";

/**
 * Hidden until real certification data is supplied (Build Spec §6.8) —
 * do not fabricate entries to fill this section.
 */
export function Certifications() {
  if (certifications.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-display text-h3 font-bold text-text">Certifications</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {certifications.map((cert) => (
          <Card key={cert.id} className="flex flex-col gap-1">
            <p className="text-body text-text">{cert.name}</p>
            <p className="text-body text-text-muted">{cert.issuer}</p>
            <p className="font-mono text-xs text-text-muted">{cert.date}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
