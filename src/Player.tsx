import { TrackData } from "./Types";
import { useState } from 'react';

function Player(props: {
  tracks: TrackData[];
  currentTrackPos: number;
  setCurrentTrackPos: Function;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  let currentTrack = props.tracks[props.currentTrackPos];

  function handleNext() {
    let pos = props.currentTrackPos;
    if (pos < props.tracks.length - 1) {
      pos++;
    }
    props.setCurrentTrackPos(pos);
  }

  function handlePrev() {
    let pos = props.currentTrackPos;
    if (pos > 0) {
      pos--;
    }
    props.setCurrentTrackPos(pos);
  }

  return (
    <div>
      <audio id="audioplayer"></audio>
      <img
        className="prevTrack"
        alt="previous track"
        title="previous track"
        src="/images/prevtrack.png"
        onClick={handlePrev}
      />
      <img
        className="playPause"
        alt="play"
        title="play"
        src="/images/play.png"
      />
      <img
        className="nextTrack"
        alt="next track"
        title="next track"
        src="/images/nexttrack.png"
        onClick={handleNext}
      />
    </div>
  );
}

export default Player;
