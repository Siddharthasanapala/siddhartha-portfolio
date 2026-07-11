"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui";
import { useChatWidget } from "@/components/chatbot/ChatWidgetProvider";
import { fadeUp, fadeUpReduced, staggerContainer } from "@/lib/motion";
import type { Profile } from "@/types";
import { Avatar } from "./Avatar";
import { TypingText } from "./TypingText";

/**
 * Hero content animates in on load (not scroll-triggered) per Build Spec §5 —
 * uses initial/animate rather than whileInView, since Hero is always the
 * first thing visible.
 */
export function HeroContent({ profile }: { profile: Profile }) {
  const shouldReduceMotion = useReducedMotion();
  const { open } = useChatWidget();
  const item = shouldReduceMotion ? fadeUpReduced : fadeUp;

  return (
    <motion.div
      className="flex flex-col items-start gap-6"
      variants={staggerContainer(shouldReduceMotion ? 0 : 0.1)}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={item}>
        <Avatar src={profile.profileImageUrl} name={profile.name} />
      </motion.div>

      <motion.p variants={item} className="text-body text-text-muted">
        {profile.greeting}
      </motion.p>

      <motion.h1
        variants={item}
        className="whitespace-nowrap font-display text-h1 font-bold text-text"
      >
        {profile.name}
      </motion.h1>

      <motion.div variants={item}>
        <TypingText phrases={profile.typingPhrases} />
      </motion.div>

      <motion.p variants={item} className="max-w-prose text-body text-text-muted">
        {profile.description}
      </motion.p>

      <motion.div variants={item} className="flex flex-wrap gap-3 pt-2">
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
