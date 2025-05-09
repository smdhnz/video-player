"use client";

import { useRef, useState, useEffect } from "react";

type VideoFile = File & { url: string };

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [file, setFile] = useState<VideoFile | null>(null);
  const [rotate, setRotate] = useState(0);

  /** seek-bar／各種 UI を表示するか */
  const [showUI, setShowUI] = useState(false);
  const hideUITimer = useRef<NodeJS.Timeout | null>(null);

  /** overlay */
  const [overlay, setOverlay] = useState("");
  const [progress, setProgress] = useState(0);

  /* -------------------- ユーティリティ -------------------- */
  const scheduleHideUI = () => {
    if (hideUITimer.current) clearTimeout(hideUITimer.current);
    hideUITimer.current = setTimeout(() => setShowUI(false), 3000);
  };

  const handlePointerMove = () => {
    setShowUI(true);
    scheduleHideUI();
  };

  const showOverlay = (text: string) => {
    setOverlay(text);
    setTimeout(() => setOverlay(""), 2000); // ← 2秒に延長
  };

  /* -------------------- ドロップ -------------------- */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = Array.from(e.dataTransfer.files).find((f) =>
      f.type.startsWith("video/"),
    );
    if (droppedFile) {
      const videoFile: VideoFile = Object.assign(droppedFile, {
        url: URL.createObjectURL(droppedFile),
      });
      setFile(videoFile);
    }
  };

  /* -------------------- フルスクリーン -------------------- */
  const enterFullscreen = async () => {
    const el = document.documentElement;
    if (!document.fullscreenElement && el.requestFullscreen) {
      await el.requestFullscreen();
    }
  };
  const exitFullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
  };
  const toggleFullscreen = () => {
    document.fullscreenElement ? exitFullscreen() : enterFullscreen();
    setShowUI(true); // フルスクリーン直後に 3 秒だけ表示
    scheduleHideUI();
    showOverlay("全画面切替");
  };

  /* -------------------- キーボード -------------------- */
  const handleKey = (e: KeyboardEvent) => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    switch (e.key) {
      case "h":
        video.currentTime -= 5;
        setShowUI(true);
        showOverlay("5秒戻る");
        break;
      case "l":
        video.currentTime += 5;
        setShowUI(true);
        showOverlay("5秒進む");
        break;
      case "k":
        video.volume = Math.min(video.volume + 0.05, 1);
        showOverlay(`音量 ${Math.round(video.volume * 100)}%`);
        break;
      case "j":
        video.volume = Math.max(video.volume - 0.05, 0);
        showOverlay(`音量 ${Math.round(video.volume * 100)}%`);
        break;
      case " ":
        e.preventDefault();
        if (video.paused) {
          video.play();
          showOverlay("再生");
        } else {
          video.pause();
          showOverlay("停止");
        }
        break;
      case "f":
        toggleFullscreen();
        break;
      case "r":
        setRotate((prev) => (prev + 90) % 360);
        showOverlay("回転");
        break;
    }
  };

  /* -------------------- 各種リスナー -------------------- */
  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    window.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("fullscreenchange", handlePointerMove); // FS 直後に 1 度呼び出し

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("fullscreenchange", handlePointerMove);
      if (hideUITimer.current) clearTimeout(hideUITimer.current);
    };
  }, []);

  /* ファイル読み込み時：初期状態で 3 秒だけ seek-bar 表示 */
  useEffect(() => {
    if (file) {
      setShowUI(true);
      scheduleHideUI();
      if (videoRef.current) videoRef.current.volume = 0;
    }
  }, [file]);

  /* 進捗計算 */
  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const update = () =>
      video.duration && setProgress(video.currentTime / video.duration);
    video.addEventListener("timeupdate", update);
    return () => video.removeEventListener("timeupdate", update);
  }, [file]);

  /* -------------------- スタイル -------------------- */
  const isRotated = rotate % 180 !== 0;
  const videoStyle: React.CSSProperties = {
    transform: `rotate(${rotate}deg)`,
    width: isRotated ? "100vh" : "100vw",
    height: isRotated ? "100vw" : "100vh",
    objectFit: "contain",
  };

  return (
    <div
      className="h-screen w-screen bg-black text-white flex items-center justify-center relative"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* ────────── seek-bar ────────── */}
      {file && (
        <div
          className={`fixed bottom-0 left-0 w-full h-2 bg-gray-600 cursor-pointer z-50
                      transition-opacity duration-300 ${showUI ? "opacity-40" : "opacity-0"}`}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            videoRef.current &&
              videoRef.current.duration &&
              (videoRef.current.currentTime =
                percent * videoRef.current.duration);
          }}
        >
          <div
            className="h-full bg-white"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}

      {/* ────────── overlay ────────── */}
      {overlay && (
        <div className="fixed top-2 right-4 text-white font-semibold text-sm z-50 pointer-events-none">
          {overlay}
        </div>
      )}

      {/* ────────── video / drop area ────────── */}
      {file ? (
        <video
          key={file.url}
          ref={videoRef}
          src={file.url}
          autoPlay
          className=""
          style={videoStyle}
          playsInline
          muted={false}
        />
      ) : (
        <div className="text-center border-4 border-dashed border-gray-500 p-8 rounded-lg">
          <p>ビデオファイルをドラッグ＆ドロップ</p>
          <p className="text-sm mt-2">
            {"j/k: 音量 / h/l: シーク / space: 再生停止 / f: 全画面 / r: 回転"}
          </p>
        </div>
      )}
    </div>
  );
}
