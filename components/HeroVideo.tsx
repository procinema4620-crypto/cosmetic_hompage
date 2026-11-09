"use client";

import { useEffect, useRef, useState } from "react";

const SRC = "/media/mainmodelvideo.mp4";
/** 끝나기 이 시간(초) 전부터 다음 영상이 위에서 겹쳐 나타납니다 */
const FADE = 1;
/** 페이지가 보여질 때 영상을 재생하는 총 횟수 (이후 마지막 장면에서 멈춤) */
const MAX_PLAYS = 2;

/**
 * 같은 영상을 2개 겹쳐 두고 크로스페이드로 이어 붙여,
 * loop 속성의 '끝 → 처음' 순간 끊김을 없앱니다.
 * 총 MAX_PLAYS번 재생한 뒤에는 마지막 장면에서 멈추고, 재생 버튼을 누르면 다시 시작합니다.
 */
export default function HeroVideo() {
  const refs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];
  const active = useRef(0);
  const fading = useRef(false);
  const plays = useRef(1);
  const finished = useRef(false);
  const [playing, setPlaying] = useState(true);
  const playingRef = useRef(true);

  useEffect(() => {
    const [a, b] = [refs[0].current, refs[1].current];
    if (!a || !b) return;
    a.style.opacity = "1";
    a.style.zIndex = "-3";
    b.style.opacity = "0";
    b.style.zIndex = "-4";

    let raf = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const cur = refs[active.current].current!;
      const next = refs[1 - active.current].current!;
      const d = cur.duration;

      if (plays.current >= MAX_PLAYS && !fading.current && !finished.current && cur.ended) {
        finished.current = true;
        playingRef.current = false;
        setPlaying(false);
      }

      if (!fading.current && playingRef.current && plays.current < MAX_PLAYS && d && isFinite(d) && d - cur.currentTime <= FADE) {
        fading.current = true;
        plays.current += 1;
        next.currentTime = 0;
        next.style.transition = "none";
        next.style.opacity = "0";
        next.style.zIndex = "-2";
        next.play().catch(() => {});
        // 다음 프레임에 페이드 인 시작
        requestAnimationFrame(() => {
          next.style.transition = `opacity ${FADE}s linear`;
          next.style.opacity = "1";
        });
        timer = setTimeout(() => {
          cur.pause();
          cur.currentTime = 0;
          cur.style.transition = "none";
          cur.style.opacity = "0";
          cur.style.zIndex = "-4";
          next.style.zIndex = "-3";
          active.current = 1 - active.current;
          fading.current = false;
        }, FADE * 1000 + 50);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    const vids = refs.map((r) => r.current!);
    if (finished.current) {
      // 2번 재생이 끝난 뒤 다시 누르면 처음부터 다시 2번 재생
      finished.current = false;
      plays.current = 1;
      vids[active.current].currentTime = 0;
      vids[active.current].play().catch(() => {});
      playingRef.current = true;
      setPlaying(true);
      return;
    }
    if (playingRef.current) {
      vids.forEach((v) => v.pause());
      playingRef.current = false;
      setPlaying(false);
    } else {
      vids[active.current].play().catch(() => {});
      if (fading.current) vids[1 - active.current].play().catch(() => {});
      playingRef.current = true;
      setPlaying(true);
    }
  };

  return (
    <>
      <video
        ref={refs[0]}
        className="hero-video"
        src={SRC}
        poster="/media/mainmodel1.jpg"
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <video ref={refs[1]} className="hero-video" style={{ opacity: 0, zIndex: -4 }} src={SRC} muted playsInline preload="auto" aria-hidden="true" />
      <button className="hero-toggle" onClick={toggle} aria-label={playing ? "영상 일시정지" : "영상 재생"}>
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="2" y="1" width="3.5" height="12" /><rect x="8.5" y="1" width="3.5" height="12" /></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 1l9 6-9 6z" /></svg>
        )}
      </button>
    </>
  );
}
