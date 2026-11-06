"use client";

import { AlphaTabApi, model, synth } from "@coderline/alphatab";
import { useEffect, useRef, useState } from "react";

const SPEEDS = [0.5, 0.75, 0.9, 1, 1.25, 1.5];
const btn =
  "rounded-md bg-black px-3 py-1.5 text-sm text-white hover:bg-black/80 disabled:opacity-40";
const btnOutline =
  "rounded-md border px-3 py-1.5 text-sm hover:bg-black/5 disabled:opacity-40";

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
        <button
          type="button"
          className={btn}
          disabled={!ready}
          onClick={() => apiRef.current?.playPause()}
        >
          {playing ? "Pauza" : "Přehrát"}
        </button>
        <button
          type="button"
          className={btnOutline}
          disabled={!ready}
          onClick={() => apiRef.current?.stop()}
        >
          Stop
        </button>
        <button
          type="button"
          className={metronome ? btn : btnOutline}
          disabled={!ready}
          onClick={toggleMetronome}
        >
          Metronom
        </button>
        <button
          type="button"
          className={loop ? btn : btnOutline}
          disabled={!ready}
          onClick={toggleLoop}
        >
          Opakovat
        </button>
        <label className="flex items-center gap-1 text-sm">
          Tempo
          <select
            className="h-8 rounded-md border bg-transparent px-2 text-sm"
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
          <label className="flex items-center gap-1 text-sm">
            Stopa
            <select
              className="h-8 rounded-md border bg-transparent px-2 text-sm"
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
      </div>
      {!ready && !error && (
        <p className="text-sm text-muted-foreground">Načítám noty a zvuk…</p>
      )}
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
