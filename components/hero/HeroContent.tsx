"use client";

import { m } from "framer-motion";
import { Button } from "@/components/ui";
import { useChatWidget } from "@/components/chatbot/ChatWidgetProvider";
import { slideUp, staggerContainer } from "@/lib/motion";
import type { Profile } from "@/types";
import { Avatar } from "./Avatar";
import { TypingText } from "./TypingText";

/**
 * Hero content animates in on load (not scroll-triggered) per Build Spec §5 —
 * uses initial/animate rather than whileInView, since Hero is always the
 * first thing visible. Always renders the same slideUp variant on server and
 * client — see Reveal.tsx for why (MotionConfig in app/layout.tsx handles
 * reduced motion hydration-safely instead of per-component branching).
 *
 * Uses slideUp (y-only, no opacity dip) rather than fadeUp for every child
 * here specifically because Lighthouse's LCP candidate within Hero varies by
 * viewport (the H1 on desktop, the description paragraph on mobile) — any
 * of them animating from opacity:0 delayed LCP by ~1.2-1.3s since Chrome
 * can't count an invisible element as "painted" until Framer Motion
 * hydrates and fades it in.
 */
export function HeroContent({ profile }: { profile: Profile }) {
  const { open } = useChatWidget();

  return (
    <m.div
      className="flex flex-col items-start gap-6"
      variants={staggerContainer(0.1)}
      initial="hidden"
      animate="visible"
    >
      <m.div variants={slideUp}>
        <Avatar src={profile.profileImageUrl} name={profile.name} />
      </m.div>

      <m.p variants={slideUp} className="text-body text-text-muted">
        {profile.greeting}
      </m.p>

      <m.h1
        variants={slideUp}
        className="whitespace-nowrap font-display text-h1 font-bold text-text"
      >
        {profile.name}
      </m.h1>

      <m.div variants={slideUp}>
        <TypingText phrases={profile.typingPhrases} />
      </m.div>

      <m.p variants={slideUp} className="max-w-prose text-body text-text-muted">
        {profile.description}
      </m.p>

      <m.div variants={slideUp} className="flex flex-wrap gap-3 pt-2">
        <Button variant="primary" onClick={open}>
          Chat with my AI assistant
        </Button>
        <Button variant="secondary" href={profile.resumeUrl} download>
          Download Résumé
        </Button>
      </m.div>
    </m.div>
  );
}
