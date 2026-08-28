"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { beatFor } from "@/data/screens";
import type { GtmJob, Participant } from "@/data/types";
import type { DemoPlayback } from "@/hooks/useDemoPlayback";
import { DEFAULT_ACCOUNT } from "@/lib/account";
import { ArtifactCard } from "./ArtifactCard";
import { BotComputer } from "./BotComputer";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function isLight(hex?: string) {
  if (!hex || !hex.startsWith("#") || hex.length < 7) return false;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 180;
}

function GrokFace() {
  return (
    <svg className="msg-face" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#111" />
      <rect
        x="5.4"
        y="8"
        width="4.1"
        height="7.4"
        rx="2.05"
        fill="#fff"
        transform="rotate(-18 7.45 11.7)"
      />
      <rect
        x="14.5"
        y="8"
        width="4.1"
        height="7.4"
        rx="2.05"
        fill="#fff"
        transform="rotate(-18 16.55 11.7)"
      />
    </svg>
  );
}

function BotAvatar({
  bot,
  size = "md",
}: {
  bot?: Participant;
  size?: "sm" | "md";
}) {
  const color = bot?.color || "#8E8E93";
  return (
    <span
      className={`gb-avatar gb-avatar-${size}`}
      style={{
        background: color,
        color: isLight(color) ? "#111" : "#fff",
      }}
    >
      {initials(bot?.name || "Bot")}
    </span>
  );
}

function MonitorIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <rect
        x="3"
        y="4.5"
        width="18"
        height="12"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M8 20h8M12 16.5V20" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function Thread({
  playback,
  streamRef,
}: {
  playback: DemoPlayback;
  streamRef: RefObject<HTMLDivElement | null>;
}) {
  const { people, visible, typingFrom, sentDrafts, sendDraft } = playback;

  return (
    <div className="msg-stream" ref={streamRef} role="log" aria-live="polite">
      {visible.map((message) => {
        const who = people[message.from];
        const isYou = who?.role === "you";
        const isSystem = message.kind === "routine";

        if (isSystem) {
          return (
            <div key={message.id} className="msg-note">
              {message.kind === "routine" ? "Routine · " : ""}
              {message.body}
            </div>
          );
        }

        if (message.kind === "draft") {
          const sent = sentDrafts[message.id];
          return (
            <div key={message.id} className="msg-row in">
              <GrokFace />
              <div className="msg-bubble in draft">
                <p className="draft-label">
                  {message.draftLabel || "Draft"} · not sent
                </p>
                {message.body ? (
                  <pre className="draft-body">{message.body}</pre>
                ) : null}
                {message.artifact ? (
                  <ArtifactCard artifact={message.artifact} />
                ) : null}
                {sent ? (
                  <p className="draft-sent">Sent. You approved this one.</p>
                ) : (
                  <button
                    type="button"
                    className="draft-send"
                    onClick={() => sendDraft(message.id)}
                  >
                    Send?
                  </button>
                )}
              </div>
            </div>
          );
        }

        return (
          <div key={message.id} className={`msg-row ${isYou ? "out" : "in"}`}>
            {!isYou ? <GrokFace /> : null}
            <div className={`msg-bubble ${isYou ? "out" : "in"}`}>
              {message.body}
            </div>
          </div>
        );
      })}
      {typingFrom ? (
        <div className="msg-row in">
          <GrokFace />
          <div className="msg-bubble in typing" aria-label="Bot is typing">
            <span />
            <span />
            <span />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function GrokBotWindow({
  job,
  playback,
}: {
  job: GtmJob;
  playback: DemoPlayback;
}) {
  const {
    liveThread,
    people,
    visibleCount,
    messages,
    playing,
    done,
    typingFrom,
    draftAccount,
    setDraftAccount,
    setPlaying,
    replay,
    applyAccount,
    current,
  } = playback;

  const streamRef = useRef<HTMLDivElement>(null);
  const [showComputer, setShowComputer] = useState(true);
  const [showMobileComputer, setShowMobileComputer] = useState(false);
  const threadBots = liveThread.participants.filter((p) => p.role === "bot");
  const speakingId =
    typingFrom ||
    (current && people[current.from]?.role === "bot" ? current.from : null);
  const headerBot =
    (speakingId && people[speakingId]) || threadBots[0];
  const working = Boolean(playing && !done) || Boolean(typingFrom);
  const beat =
    beatFor(
      job.id,
      typingFrom ? messages[visibleCount]?.id : current?.id,
    ) || beatFor(job.id, messages[0]?.id);

  useEffect(() => {
    const stream = streamRef.current;
    if (!stream) return;
    stream.scrollTop = stream.scrollHeight;
  }, [visibleCount, typingFrom]);

  return (
    <div className={`demo-stage${showComputer ? " is-split" : ""}`}>
      <div className="gb-product" aria-label="Grok Bot">
        <div className="desk-bar">
          <span className="traffic" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <strong>{headerBot?.name || "Grok Bot"}</strong>
          {working ? <em className="desk-working">Working</em> : null}
          <span className="desk-grow" />
          {showComputer ? (
            <button
              type="button"
              className="desk-done"
              onClick={() => setShowComputer(false)}
            >
              Done
            </button>
          ) : null}
          <button
            type="button"
            className={`desk-monitor${showComputer ? " is-on" : ""}`}
            aria-label={showComputer ? "Hide computer" : "Open computer"}
            aria-pressed={showComputer}
            onClick={() => setShowComputer((value) => !value)}
          >
            <MonitorIcon />
          </button>
        </div>

        <div className="gb-cols">
          <section className="gb-thread">
            <div className="ios-island" aria-hidden />
            <header className="ios-header">
              <span className="ios-back" aria-hidden>
                ‹
              </span>
              <div className="ios-who">
                <BotAvatar bot={headerBot} />
                <div>
                  <strong>{headerBot?.name || "Grok Bot"}</strong>
                  <span className={`ios-live${working ? " is-on" : ""}`}>
                    <i />
                    {working ? "Working" : "Ready"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className={`ios-monitor${showMobileComputer ? " is-on" : ""}`}
                aria-label={
                  showMobileComputer ? "Hide computer" : "Open computer"
                }
                aria-pressed={showMobileComputer}
                onClick={() => setShowMobileComputer((value) => !value)}
              >
                <MonitorIcon />
              </button>
            </header>

            <Thread playback={playback} streamRef={streamRef} />

            <div className="msg-composer">
              <span className="msg-plus" aria-hidden>
                +
              </span>
              <span className="msg-field">
                Message {headerBot?.name || "Grok Bot"}
              </span>
              <span className="msg-cam" aria-hidden>
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path
                    d="M4 8.5h3.1l1.2-2h7.4l1.2 2H20a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18v-8A1.5 1.5 0 0 1 4 8.5Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <circle
                    cx="12"
                    cy="13.2"
                    r="3.1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              </span>
              <span className="msg-mic" aria-hidden>
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <rect
                    x="9"
                    y="3.5"
                    width="6"
                    height="10"
                    rx="3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                </svg>
              </span>
            </div>
            <div className="ios-home" aria-hidden />
          </section>

          {showComputer ? (
            <div className="pc-screen pc-desk">
              <div className="pc-screen-bar">
                <strong>Computer</strong>
                <span className={`pc-live${working ? " is-on" : ""}`}>
                  <i />
                  {working ? "Working" : beat?.pill || "Ready"}
                </span>
                <button type="button" onClick={() => setShowComputer(false)}>
                  Done
                </button>
              </div>
              <BotComputer jobId={job.id} playback={playback} />
            </div>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        className={`mobile-pc-toggle${showMobileComputer ? " is-on" : ""}`}
        aria-pressed={showMobileComputer}
        onClick={() => setShowMobileComputer((value) => !value)}
      >
        {showMobileComputer ? "Hide computer" : "Show computer"}
      </button>

      {showMobileComputer ? (
        <div className="pc-screen pc-phone">
          <div className="pc-screen-bar">
            <strong>Computer</strong>
            <span className={`pc-live${working ? " is-on" : ""}`}>
              <i />
              {working ? "Working" : beat?.pill || "Ready"}
            </span>
          </div>
          <BotComputer jobId={job.id} playback={playback} />
        </div>
      ) : null}

      <div className="demo-tools">
        <button
          type="button"
          onClick={() => (done ? replay() : setPlaying((value) => !value))}
        >
          {done ? "Replay" : playing ? "Pause" : "Play"}
        </button>
        <form onSubmit={applyAccount}>
          <label htmlFor={`acct-${job.id}`}>Account</label>
          <input
            id={`acct-${job.id}`}
            value={draftAccount}
            onChange={(event) => setDraftAccount(event.target.value)}
            placeholder={DEFAULT_ACCOUNT}
          />
          <button type="submit">Use name</button>
        </form>
      </div>
    </div>
  );
}
