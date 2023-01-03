import { TrackData } from "./Types";

function Player(props: { tracks: TrackData[]; currentTrackPos: number; setCurrentTrackPos: Function }) {
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

  return (<div><div onClick={handleNext}>NEXT</div> <div onClick={handlePrev}>PREV</div></div>);
}

export default Player;
