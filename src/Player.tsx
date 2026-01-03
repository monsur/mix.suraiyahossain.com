import { TrackData } from "./Types";
import { useState, useRef, useEffect } from "react";
import * as Sentry from "@sentry/react";
import NextIcon from "./assets/nexttrack.svg?react";
import PrevIcon from "./assets/prevtrack.svg?react";
import PlayIcon from "./assets/play.svg?react";
import PauseIcon from "./assets/pause.svg?react";
import "./Player.css";
import Logger from "./Logger";

function Player(props: {
  tracks: TrackData[];
  currentTrackPos: number;
  setCurrentTrackPos: (pos: number) => void;
  textColor: string;
}) {
  const currentTrack = props.tracks[props.currentTrackPos];
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(new Audio());
  audioRef.current.onended = () => {
    const oldTrackPos = props.currentTrackPos + 1;
    if (oldTrackPos < props.tracks.length) {
      props.setCurrentTrackPos(oldTrackPos);
    } else {
      setIsPlaying(false);
      props.setCurrentTrackPos(0);
    }
  };

  // Handle audio errors
  audioRef.current.onerror = () => {
    const error = new Error(`Audio playback error: ${currentTrack.url}`);
    Logger.error("Player", "audio-error", error.message, currentTrack.year);
    Sentry.captureException(error, {
      tags: {
        component: "Player",
        errorType: "audio-playback",
      },
      extra: {
        trackUrl: currentTrack.url,
        trackTitle: currentTrack.title,
        trackArtist: currentTrack.artist,
        year: currentTrack.year,
      },
    });
  };

  function handleNext(): void {
    let pos = props.currentTrackPos;
    if (pos < props.tracks.length - 1) {
      pos++;
    }
    props.setCurrentTrackPos(pos);
    Logger.log("Player", "click", "next", currentTrack.year);
  }

  function handlePrev(): void {
    let pos = props.currentTrackPos;
    if (pos > 0) {
      pos--;
    } else {
      // Already at the first track, reset time to zero.
      audioRef.current.currentTime = 0;
    }
    props.setCurrentTrackPos(pos);
    Logger.log("Player", "click", "prev", currentTrack.year);
  }

  function handlePlayPause(val: boolean): void {
    setIsPlaying(val);
    const label = val ? "play" : "pause";
    Logger.log("Player", "click", label, currentTrack.year);
  }

  function play(): void {
    audioRef.current.play().catch((e) => {
      if ("name" in e && e.name === "AbortError") {
        // Ignore the error, since this is most likely due to user
        // navigating away before the play() function as competed.
        // Revisit this if there are other valid use cases that are
        // being ignored.
      } else {
        // Capture unexpected play errors
        Logger.error("Player", "play-error", e.message, currentTrack.year);
        Sentry.captureException(e, {
          tags: {
            component: "Player",
            errorType: "play-failed",
          },
          extra: {
            trackUrl: currentTrack.url,
            trackTitle: currentTrack.title,
            year: currentTrack.year,
          },
        });
        throw e;
      }
    });
  }

  function pause(): void {
    audioRef.current.pause();
  }

  useEffect(() => {
    if (isPlaying) {
      play();
    } else {
      pause();
    }
     
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      pause();
    }

    audioRef.current.src = currentTrack.url;
    Logger.log("Player", "track", currentTrack.url, currentTrack.year);

    if (isPlaying) {
      play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
       
      pause();
    };
  });

  const iconStyle = { width: "50px", fill: props.textColor };

  return (
    <div className="Player">
      <PrevIcon style={iconStyle} onClick={handlePrev} />
      <span className="playPause">
        {isPlaying ? (
          <PauseIcon style={iconStyle} onClick={() => handlePlayPause(false)} />
        ) : (
          <PlayIcon style={iconStyle} onClick={() => handlePlayPause(true)} />
        )}
      </span>
      <NextIcon style={iconStyle} onClick={handleNext} />
    </div>
  );
}

export default Player;
