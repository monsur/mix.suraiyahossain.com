import "./Footer.css";

function Footer(props: { textColor: string }) {
  const style = { color: props.textColor };

  return (
    <div className="Footer" style={style}>
      <div className="FooterLine">
        a yearly playlist designed to reflect moments
      </div>
      <div className="FooterLine">
        through typography, photography, color, and sound
      </div>
    </div>
  );
}

export default Footer;
