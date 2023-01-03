function Player() {

  function handleClick() {
  alert('boo');
  }

  return (<div onClick={handleClick}>This is a test.</div>)
}

export default Player;