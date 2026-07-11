"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { useChatWidget } from "@/components/chatbot/ChatWidgetProvider";
import { fadeUp, staggerContainer } from "@/lib/motion";
import type { Profile } from "@/types";
import { Avatar } from "./Avatar";
import { TypingText } from "./TypingText";

/**
 * Hero content animates in on load (not scroll-triggered) per Build Spec §5 —
 * uses initial/animate rather than whileInView, since Hero is always the
 * first thing visible. Always renders the same fadeUp variant on server and
 * client — see Reveal.tsx for why (MotionConfig in app/layout.tsx handles
 * reduced motion hydration-safely instead of per-component branching).
 */
export function HeroContent({ profile }: { profile: Profile }) {
  const { open } = useChatWidget();

  return (
    <motion.div
      className="flex flex-col items-start gap-6"
      variants={staggerContainer(0.1)}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeUp}>
        <Avatar src={profile.profileImageUrl} name={profile.name} />
      </motion.div>

      <motion.p variants={fadeUp} className="text-body text-text-muted">
        {profile.greeting}
      </motion.p>

      <motion.h1
        variants={fadeUp}
        className="whitespace-nowrap font-display text-h1 font-bold text-text"
      >
        {profile.name}
      </motion.h1>

      <motion.div variants={fadeUp}>
        <TypingText phrases={profile.typingPhrases} />
      </motion.div>

      <motion.p variants={fadeUp} className="max-w-prose text-body text-text-muted">
        {profile.description}
      </motion.p>

      <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
        <Button variant="primary" onClick={open}>
          Chat with my AI assistant
        </Button>
        <Button variant="secondary" href={profile.resumeUrl} download>
          Download Résumé
        </Button>
      </motion.div>
    </motion.div>
  );
}
