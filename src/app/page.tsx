"use client";

import { useRef, useState, useEffect } from "react";

type VideoFile = File & { url: string };

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [file, setFile] = useState<VideoFile | null>(null);
  const [rotate, setRotate] = useState(0);
  const [overlay, setOverlay] = useState("");
  const [progress, setProgress] = useState(0);

  const showOverlay = (text: string) => {
    setOverlay(text);
    setTimeout(() => setOverlay(""), 1000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = Array.from(e.dataTransfer.files).find((file) =>
      file.type.startsWith("video/"),
    );
    if (droppedFile) {
      const videoFile = Object.assign(droppedFile, {
        url: URL.createObjectURL(droppedFile),
      });
      setFile(videoFile);
    }
  };

  const enterFullscreen = async () => {
    const el = document.documentElement;
    if (!document.fullscreenElement && el.requestFullscreen) {
      await el.requestFullscreen();
    }
  };

  const exitFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  };

  const toggleFullscreen = () => {
    document.fullscreenElement ? exitFullscreen() : enterFullscreen();
    showOverlay("全画面切替");
  };

  const handleKey = (e: KeyboardEvent) => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    switch (e.key) {
      case "h":
        video.currentTime -= 5;
        showOverlay("5秒戻る");
        break;
      case "l":
        video.currentTime += 5;
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

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (videoRef.current && file) {
      videoRef.current.volume = 0;
    }
  }, [file]);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const updateProgress = () => {
      if (video.duration) {
        setProgress(video.currentTime / video.duration);
      }
    };

    video.addEventListener("timeupdate", updateProgress);
    return () => video.removeEventListener("timeupdate", updateProgress);
  }, [file]);

  const isRotated = rotate % 180 !== 0;
  const videoStyle: React.CSSProperties = {
    transform: `rotate(${rotate}deg)`,
    maxHeight: isRotated ? "100vw" : "100vh",
    maxWidth: isRotated ? "100vh" : "100vw",
    objectFit: "contain",
  };

  return (
    <div
      className="h-screen w-screen bg-black text-white flex items-center justify-center relative"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* シークバー */}
      {file && (
        <div
          className="fixed bottom-0 left-0 w-full h-1 bg-gray-600 cursor-pointer z-50"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percent = clickX / rect.width;
            if (videoRef.current && videoRef.current.duration) {
              videoRef.current.currentTime =
                percent * videoRef.current.duration;
            }
          }}
        >
          <div
            className="h-full bg-white"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}

      {/* オーバーレイメッセージ */}
      {overlay && (
        <div className="fixed top-2 right-4 text-white font-semibold text-sm z-50 pointer-events-none">
          {overlay}
        </div>
      )}

      {/* 動画表示 or ドロップ案内 */}
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
