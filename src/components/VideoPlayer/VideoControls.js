"use client";

import React from "react";
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

export default function VideoControls({
  isPlaying,
  volume,
  isMuted,
  currentSpeed,
  viewMode,
  onPlayPause,
  onVolumeChange,
  onMuteToggle,
  onSpeedChange,
  onViewModeChange,
}) {
  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX />;
    if (volume < 0.5) return <Volume1 />;
    return <Volume2 />;
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
      <div className="flex items-center justify-between text-white">
        <div className="flex items-center space-x-4">
          <button
            onClick={onPlayPause}
            className="hover:text-blue-400 transition-colors"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <div className="flex items-center space-x-2 group relative">
            <button
              onClick={onMuteToggle}
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
                onValueChange={(value) => onVolumeChange(value[0] / 100)}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Select value={currentSpeed} onValueChange={onSpeedChange}>
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
                onClick={() => onViewModeChange("theater")}
                className="hover:text-blue-400 transition-colors"
                title="Theater mode"
              >
                <Circle size={20} />
              </button>
            )}
            {viewMode === "theater" && (
              <button
                onClick={() => onViewModeChange("default")}
                className="hover:text-blue-400 transition-colors"
                title="Default view"
              >
                <Circle size={20} />
              </button>
            )}
            <button
              onClick={() =>
                onViewModeChange(
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
  );
}
