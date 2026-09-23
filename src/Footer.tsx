import "./Footer.css";

function Footer(props: { textColor: string }) {
  const style = { color: props.textColor };

  return (
    <div className="Footer" style={style}>
      <div className="FooterLine">
        a yearly playlist designed to reflect moments and memory
      </div>
      <div className="FooterLine">
        through song selection, typography, photography and color
      </div>
    </div>
  );
}

export default Footer;
