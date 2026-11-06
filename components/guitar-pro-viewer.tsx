"use client";

import { AlphaTabApi, model, synth } from "@coderline/alphatab";
import {
  Gauge,
  ListMusic,
  Loader2,
  Pause,
  Play,
  Repeat,
  Square,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

function MetronomeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 3h4l4.5 18h-13z" />
      <path d="M12 17 16 7" />
      <circle cx="14.4" cy="11" r="1" />
    </svg>
  );
}

const SPEEDS = [0.5, 0.75, 0.9, 1, 1.25, 1.5];
const base =
  "inline-flex h-9 w-9 items-center justify-center rounded-md disabled:opacity-40";
const solid = `${base} bg-black text-white hover:bg-black/80`;
const outline = `${base} border hover:bg-black/5`;

function IconButton({
  label,
  onClick,
  disabled,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={active ? solid : outline}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function GuitarProViewer({ fileUrl }: { fileUrl: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<AlphaTabApi | null>(null);
  const scoreRef = useRef<model.Score | null>(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [tracks, setTracks] = useState<string[]>([]);
  const [track, setTrack] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [metronome, setMetronome] = useState(false);
  const [loop, setLoop] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const api = new AlphaTabApi(hostRef.current!, {
      core: {
        file: fileUrl,
        fontDirectory: "/alphatab/font/",
        scriptFile: "/alphatab/alphaTab.mjs",
      },
      player: {
        enablePlayer: true,
        enableCursor: true,
        enableAnimatedBeatCursor: true,
        enableElementHighlighting: true,
        enableUserInteraction: true,
        soundFont: "/alphatab/soundfont/sonivox.sf2",
        scrollElement: scrollRef.current!,
      },
    });
    apiRef.current = api;

    api.scoreLoaded.on((score) => {
      scoreRef.current = score;
      setTracks(score.tracks.map((t) => t.name || `Stopa ${t.index + 1}`));
      setTrack(0);
    });
    api.playerReady.on(() => setReady(true));
    api.playerStateChanged.on((e) =>
      setPlaying(e.state === synth.PlayerState.Playing)
    );
    api.error.on((e) =>
      setError(e instanceof Error ? e.message : "Soubor se nepodařilo načíst.")
    );

    return () => {
      api.destroy();
      apiRef.current = null;
      scoreRef.current = null;
      setReady(false);
      setPlaying(false);
    };
  }, [fileUrl]);

  function selectTrack(i: number) {
    const t = scoreRef.current?.tracks[i];
    if (!t || !apiRef.current) return;
    apiRef.current.renderTracks([t]);
    setTrack(i);
  }

  function changeSpeed(v: number) {
    if (apiRef.current) apiRef.current.playbackSpeed = v;
    setSpeed(v);
  }

  function toggleMetronome() {
    const next = !metronome;
    if (apiRef.current) apiRef.current.metronomeVolume = next ? 1 : 0;
    setMetronome(next);
  }

  function toggleLoop() {
    const next = !loop;
    if (apiRef.current) apiRef.current.isLooping = next;
    setLoop(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <IconButton
          label={playing ? "Pauza" : "Přehrát"}
          active
          disabled={!ready}
          onClick={() => apiRef.current?.playPause()}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </IconButton>
        <IconButton
          label="Stop"
          disabled={!ready}
          onClick={() => apiRef.current?.stop()}
        >
          <Square className="h-4 w-4" />
        </IconButton>
        <IconButton
          label="Metronom"
          active={metronome}
          disabled={!ready}
          onClick={toggleMetronome}
        >
          <MetronomeIcon className="h-4 w-4" />
        </IconButton>
        <IconButton
          label="Opakovat"
          active={loop}
          disabled={!ready}
          onClick={toggleLoop}
        >
          <Repeat className="h-4 w-4" />
        </IconButton>
        <label className="flex items-center gap-1" title="Tempo">
          <Gauge className="h-4 w-4" />
          <select
            className="h-9 rounded-md border bg-transparent px-2 text-sm"
            value={speed}
            onChange={(e) => changeSpeed(Number(e.target.value))}
          >
            {SPEEDS.map((s) => (
              <option key={s} value={s}>
                {Math.round(s * 100)} %
              </option>
            ))}
          </select>
        </label>
        {tracks.length > 1 && (
          <label className="flex items-center gap-1" title="Stopa">
            <ListMusic className="h-4 w-4" />
            <select
              className="h-9 rounded-md border bg-transparent px-2 text-sm"
              value={track}
              onChange={(e) => selectTrack(Number(e.target.value))}
            >
              {tracks.map((name, i) => (
                <option key={i} value={i}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        )}
        {!ready && !error && (
          <Loader2
            className="h-4 w-4 animate-spin text-muted-foreground"
            aria-label="Načítám noty a zvuk"
          />
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div
        ref={scrollRef}
        className="relative h-[75vh] overflow-y-auto rounded-lg border bg-white text-black"
      >
        <div ref={hostRef} className="relative" />
      </div>
    </div>
  );
}
