import { FormEvent, useEffect, useMemo, useState } from "react";
import type { DemoMessage, DemoThread, Participant } from "@/data/types";
import { DEFAULT_ACCOUNT, swapAccount } from "@/lib/account";

function participantMap(thread: DemoThread): Record<string, Participant> {
  return Object.fromEntries(thread.participants.map((p) => [p.id, p]));
}

function defaultDelay(message: DemoMessage, people: Record<string, Participant>) {
  if (message.delayMs) return message.delayMs;
  if (message.kind === "draft" || message.artifact) return 2800;
  if (people[message.from]?.role === "bot") {
    const chars = (message.body || "").length;
    return Math.min(2200, Math.max(1600, 1400 + chars * 8));
  }
  if (message.kind === "routine") return 1500;
  return 1300;
}

const SETTLE_MS = 500;

export function useDemoPlayback(thread: DemoThread) {
  const people = useMemo(() => participantMap(thread), [thread]);
  const [account, setAccount] = useState(DEFAULT_ACCOUNT);
  const [draftAccount, setDraftAccount] = useState(DEFAULT_ACCOUNT);
  const [visibleCount, setVisibleCount] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [typingFrom, setTypingFrom] = useState<string | null>(null);
  const [sentDrafts, setSentDrafts] = useState<Record<string, boolean>>({});
  const [inView, setInView] = useState(false);

  const liveThread = useMemo(
    () => swapAccount(thread, account),
    [thread, account],
  );
  const messages = liveThread.messages;
  const done = visibleCount >= messages.length && !typingFrom;
  const visible = messages.slice(0, visibleCount);

  useEffect(() => {
    if (!inView) {
      setPlaying(false);
      return;
    }
    setPlaying(true);
  }, [inView]);

  useEffect(() => {
    if (!playing || done) {
      setTypingFrom(null);
      return;
    }
    const next = messages[visibleCount];
    if (!next) return;
    const who = people[next.from];
    const showTyping =
      who?.role === "bot" ||
      next.kind === "draft" ||
      next.kind === "routine";
    const wait = defaultDelay(next, people);
    const timers: number[] = [];
    if (showTyping) {
      timers.push(
        window.setTimeout(() => setTypingFrom(next.from), SETTLE_MS),
      );
      timers.push(
        window.setTimeout(() => {
          setTypingFrom(null);
          setVisibleCount((count) => count + 1);
        }, SETTLE_MS + wait),
      );
    } else {
      setTypingFrom(null);
      timers.push(
        window.setTimeout(() => {
          setVisibleCount((count) => count + 1);
        }, wait),
      );
    }
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [playing, done, visibleCount, messages, people]);

  function replay() {
    setVisibleCount(0);
    setSentDrafts({});
    setTypingFrom(null);
    setPlaying(true);
  }

  function applyAccount(event: FormEvent) {
    event.preventDefault();
    const next = draftAccount.trim() || DEFAULT_ACCOUNT;
    setAccount(next);
    setDraftAccount(next);
    replay();
  }

  function sendDraft(id: string) {
    setSentDrafts((prev) => ({ ...prev, [id]: true }));
  }

  const current = typingFrom
    ? messages[visibleCount]
    : visible[visible.length - 1];

  return {
    liveThread,
    messages,
    people,
    visible,
    visibleCount,
    playing,
    done,
    typingFrom,
    sentDrafts,
    account,
    draftAccount,
    setDraftAccount,
    setPlaying,
    setInView,
    sendDraft,
    replay,
    applyAccount,
    current,
  };
}

export type DemoPlayback = ReturnType<typeof useDemoPlayback>;
