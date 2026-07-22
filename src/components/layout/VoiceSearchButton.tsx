"use client";

import * as React from "react";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import MicNoneIcon from "@mui/icons-material/MicNone";

interface SpeechRecognitionResultLike {
  transcript: string;
}

interface SpeechRecognitionEventLike {
  results: { [index: number]: { [index: number]: SpeechRecognitionResultLike } };
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function subscribeNever() {
  return () => {};
}
function getSupportedSnapshot() {
  return getSpeechRecognitionCtor() !== null;
}
function getSupportedServerSnapshot() {
  return false;
}

export default function VoiceSearchButton({ onResult }: { onResult: (text: string) => void }) {
  const supported = React.useSyncExternalStore(
    subscribeNever,
    getSupportedSnapshot,
    getSupportedServerSnapshot
  );
  const [listening, setListening] = React.useState(false);
  const recognitionRef = React.useRef<SpeechRecognitionLike | null>(null);

  if (!supported) return null;

  function handleClick() {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;
    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) onResult(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  return (
    <IconButton
      size="small"
      onClick={handleClick}
      aria-label={listening ? "Stop voice search" : "Search by voice"}
      color={listening ? "error" : "default"}
    >
      {listening ? <MicIcon fontSize="small" /> : <MicNoneIcon fontSize="small" />}
    </IconButton>
  );
}
