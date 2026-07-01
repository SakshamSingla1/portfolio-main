import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import type { Colors } from "../../../utils/theme";

interface Props {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  colors: Colors;
}

export const TypewriterText = ({ words, typingSpeed = 80, deletingSpeed = 40, pauseDuration = 2000, colors }: Props) => {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const currentWord = words[wordIdx];
    if (!isDeleting) {
      setText(currentWord.substring(0, text.length + 1));
      if (text.length + 1 === currentWord.length) {
        setTimeout(() => setIsDeleting(true), pauseDuration);
        return;
      }
    } else {
      setText(currentWord.substring(0, text.length - 1));
      if (text.length === 0) {
        setIsDeleting(false);
        setWordIdx((prev) => (prev + 1) % words.length);
      }
    }
  }, [text, wordIdx, isDeleting, words, pauseDuration]);

  useEffect(() => {
    const timer = setTimeout(tick, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, typingSpeed, deletingSpeed]);

  return (
    <span className="font-mono">
      {text}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.6 }}
        className="inline-block w-0.5 h-[1em] ml-0.5 align-middle"
        style={{ backgroundColor: colors.primary500 }}
      />
    </span>
  );
};
