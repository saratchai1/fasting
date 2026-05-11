"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { Pause, Play, RotateCcw, Square, TimerReset } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getActiveFastingSession,
  saveFastingSession,
} from "@/lib/storage";
import { formatClock, formatDuration, makeId } from "@/lib/time";
import type { FastingSession, RecommendedHours } from "@/types/fasting";

const targetOptions: RecommendedHours[] = [12, 14, 16, 18, 20];

function targetMs(hours: RecommendedHours) {
  return hours * 60 * 60 * 1000;
}

function calculateElapsedMs(session: FastingSession, nowMs: number) {
  const endMs =
    session.status === "paused" && session.pausedAt
      ? new Date(session.pausedAt).getTime()
      : nowMs;

  return Math.max(
    0,
    endMs - new Date(session.startTime).getTime() - session.totalPausedMs,
  );
}

export function FastingTimer({
  initialTargetHours = 16,
}: {
  initialTargetHours?: RecommendedHours;
}) {
  const [session, setSession] = useState<FastingSession | null>(null);
  const [targetHours, setTargetHours] = useState<RecommendedHours>(
    initialTargetHours === 0 ? 12 : initialTargetHours,
  );
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const activeSession = getActiveFastingSession();

    if (activeSession) {
      setSession(activeSession);
      setTargetHours(activeSession.targetHours === 0 ? 12 : activeSession.targetHours);
    }
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const timer = useMemo(() => {
    if (!session) {
      return {
        elapsedMs: 0,
        remainingMs: targetMs(targetHours),
        progress: 0,
      };
    }

    const elapsedMs = calculateElapsedMs(session, nowMs);
    const durationMs = targetMs(session.targetHours);
    const remainingMs = Math.max(0, durationMs - elapsedMs);

    return {
      elapsedMs,
      remainingMs,
      progress: durationMs > 0 ? Math.min(100, (elapsedMs / durationMs) * 100) : 0,
    };
  }, [nowMs, session, targetHours]);

  useEffect(() => {
    if (!session || session.status !== "running" || timer.remainingMs > 0) {
      return;
    }

    const now = new Date().toISOString();
    const completedSession: FastingSession = {
      ...session,
      status: "completed",
      endTime: now,
      updatedAt: now,
    };

    saveFastingSession(completedSession);
    setSession(completedSession);
  }, [session, timer.remainingMs]);

  function persistSession(nextSession: FastingSession) {
    saveFastingSession(nextSession);
    setSession(nextSession);
  }

  function startSession() {
    const now = new Date().toISOString();
    const nextSession: FastingSession = {
      id: makeId("session"),
      targetHours,
      startTime: now,
      status: "running",
      totalPausedMs: 0,
      createdAt: now,
      updatedAt: now,
    };

    persistSession(nextSession);
  }

  function pauseSession() {
    if (!session || session.status !== "running") {
      return;
    }

    persistSession({
      ...session,
      status: "paused",
      pausedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  function resumeSession() {
    if (!session || session.status !== "paused" || !session.pausedAt) {
      return;
    }

    const now = new Date();
    const pausedForMs = now.getTime() - new Date(session.pausedAt).getTime();

    persistSession({
      ...session,
      status: "running",
      pausedAt: undefined,
      totalPausedMs: session.totalPausedMs + pausedForMs,
      updatedAt: now.toISOString(),
    });
  }

  function stopSession() {
    if (!session) {
      return;
    }

    const now = new Date().toISOString();

    persistSession({
      ...session,
      status: "stopped",
      endTime: now,
      updatedAt: now,
    });
  }

  function resetSession() {
    setSession(null);
  }

  const activeTargetHours = session?.targetHours ?? targetHours;

  return (
    <section className="rounded-[32px] border border-[#dce5db] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#315f56]">Fasting timer</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-normal text-[#24211d]">
            {formatDuration(timer.elapsedMs)}
          </h2>
          <p className="mt-1 text-sm text-[#756b5d]">
            เหลือ {formatDuration(timer.remainingMs)}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef7ef] text-[#315f56]">
          <TimerReset size={22} aria-hidden="true" />
        </div>
      </div>

      <div className="mt-6 h-4 overflow-hidden rounded-full bg-[#efe5d6]">
        <div
          className="h-full rounded-full bg-[#315f56] transition-all"
          style={{ width: `${timer.progress}%` }}
        />
      </div>

      <div className="mt-5 grid gap-2 rounded-2xl bg-[#f7f4ee] p-4 text-sm text-[#62594f] sm:grid-cols-3">
        <p>
          เป้าหมาย <span className="font-semibold">{activeTargetHours} ชม.</span>
        </p>
        {session ? (
          <p>
            เริ่ม <span className="font-semibold">{formatClock(session.startTime)}</span>
          </p>
        ) : (
          <p>ยังไม่ได้เริ่มรอบใหม่</p>
        )}
        <p>
          สถานะ{" "}
          <span className="font-semibold">
            {session?.status === "running"
              ? "กำลัง Fast"
              : session?.status === "paused"
                ? "พักเวลา"
                : session?.status === "completed"
                  ? "ครบเป้าหมาย"
                  : session?.status === "stopped"
                    ? "หยุดแล้ว"
                    : "พร้อมเริ่ม"}
          </span>
        </p>
      </div>

      {!session ? (
        <div className="mt-5">
          <p className="text-sm font-semibold text-[#50483f]">เลือกเป้าหมาย</p>
          <div className="mt-2 grid grid-cols-5 gap-2">
            {targetOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTargetHours(option)}
                className={`h-11 rounded-2xl border text-sm font-semibold transition ${
                  targetHours === option
                    ? "border-[#315f56] bg-[#315f56] text-white"
                    : "border-[#ded4c4] bg-white text-[#62594f]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {!session || session.status === "completed" || session.status === "stopped" ? (
          <button
            type="button"
            onClick={session ? resetSession : startSession}
            className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-[#315f56] px-5 text-sm font-semibold text-white transition hover:bg-[#274c45]"
          >
            {session ? (
              <>
                <RotateCcw size={18} aria-hidden="true" />
                ตั้งรอบใหม่
              </>
            ) : (
              <>
                <Play size={18} aria-hidden="true" />
                เริ่มจับเวลา
              </>
            )}
          </button>
        ) : null}

        {session?.status === "running" ? (
          <button
            type="button"
            onClick={pauseSession}
            className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-[#d99a43] px-5 text-sm font-semibold text-white transition hover:bg-[#bd7f2d]"
          >
            <Pause size={18} aria-hidden="true" />
            พักเวลา
          </button>
        ) : null}

        {session?.status === "paused" ? (
          <button
            type="button"
            onClick={resumeSession}
            className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-[#315f56] px-5 text-sm font-semibold text-white transition hover:bg-[#274c45]"
          >
            <Play size={18} aria-hidden="true" />
            ต่อเวลา
          </button>
        ) : null}

        {session?.status === "running" || session?.status === "paused" ? (
          <button
            type="button"
            onClick={stopSession}
            className="flex h-13 items-center justify-center gap-2 rounded-2xl border border-[#efc7b2] bg-[#fff3ed] px-5 text-sm font-semibold text-[#7d351f] transition hover:border-[#d58d64]"
          >
            <Square size={17} aria-hidden="true" />
            หยุด
          </button>
        ) : null}
      </div>
    </section>
  );
}
