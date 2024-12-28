"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  Circle,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function VideoPlayer({ videoId }) {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentSpeed, setCurrentSpeed] = useState("1");
  const [viewMode, setViewMode] = useState("default"); // default, theater, fullscreen
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player("youtube-player", {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          fs: 0,
          playsinline: 1,
          iv_load_policy: 3,
          disablekb: 1,
          origin: window.location.origin,
        },
        events: {
          onStateChange: (event) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && viewMode === "fullscreen") {
        setViewMode("default");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [viewMode]);

  const handleMouseMove = () => {
    setIsControlsVisible(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setIsControlsVisible(false);
      }
    }, 3000);
  };

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (newVolume) => {
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume * 100);
      setVolume(newVolume);
      if (newVolume === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    }
  };

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume * 100);
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const handleSpeedChange = (value) => {
    if (playerRef.current) {
      playerRef.current.setPlaybackRate(parseFloat(value));
      setCurrentSpeed(value);
    }
  };

  const handleViewModeChange = (mode) => {
    if (mode === "fullscreen" && viewMode !== "fullscreen") {
      containerRef.current?.requestFullscreen();
    } else if (mode !== "fullscreen" && document.fullscreenElement) {
      document.exitFullscreen();
    }
    setViewMode(mode);
  };

  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX />;
    if (volume < 0.5) return <Volume1 />;
    return <Volume2 />;
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative bg-black rounded-lg overflow-hidden",
        viewMode === "theater" && "w-full max-w-6xl mx-auto",
        viewMode === "fullscreen" && "fixed inset-0 z-50 w-screen h-screen"
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
    >
      <div
        className={cn(
          "relative w-full",
          viewMode === "fullscreen" ? "h-screen" : "aspect-video"
        )}
      >
        <div id="youtube-player" className="absolute inset-0 w-full h-full" />
      </div>

      {/* Overlay for play/pause on video click */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={togglePlay}
        onDoubleClick={() =>
          handleViewModeChange(viewMode === "fullscreen" ? "default" : "fullscreen")
        }
      />

      {/* Video Controls */}
      {isControlsVisible && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlay}
                className="hover:text-blue-400 transition-colors"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>

              <div className="flex items-center space-x-2 group relative">
                <button
                  onClick={toggleMute}
                  className="hover:text-blue-400 transition-colors"
                >
                  <VolumeIcon />
                </button>
                <div className="w-24">
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleVolumeChange(value[0] / 100)}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Select value={currentSpeed} onValueChange={handleSpeedChange}>
                <SelectTrigger className="w-[100px] bg-black/50 border-none text-white">
                  <SelectValue placeholder="Speed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.25">0.25x</SelectItem>
                  <SelectItem value="0.5">0.5x</SelectItem>
                  <SelectItem value="0.75">0.75x</SelectItem>
                  <SelectItem value="1">Normal</SelectItem>
                  <SelectItem value="1.25">1.25x</SelectItem>
                  <SelectItem value="1.5">1.5x</SelectItem>
                  <SelectItem value="2">2x</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex space-x-2">
                {viewMode === "default" && (
                  <button
                    onClick={() => handleViewModeChange("theater")}
                    className="hover:text-blue-400 transition-colors"
                    title="Theater mode"
                  >
                    <Circle size={20} />
                  </button>
                )}
                {viewMode === "theater" && (
                  <button
                    onClick={() => handleViewModeChange("default")}
                    className="hover:text-blue-400 transition-colors"
                    title="Default view"
                  >
                    <Circle size={20} />
                  </button>
                )}
                <button
                  onClick={() =>
                    handleViewModeChange(
                      viewMode === "fullscreen" ? "default" : "fullscreen"
                    )
                  }
                  className="hover:text-blue-400 transition-colors"
                  title="Toggle fullscreen"
                >
                  {viewMode === "fullscreen" ? (
                    <Minimize size={20} />
                  ) : (
                    <Maximize size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}