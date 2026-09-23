import "./Footer.css";

function Footer(props: { textColor: string }) {
  const style = { color: props.textColor };

  return (
    <div className="Footer" style={style}>
      a yearly playlist designed to reflect moments and memory through song
      selection, typography, photography and color
    </div>
  );
}

export default Footer;
