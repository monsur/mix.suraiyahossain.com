import "./Navigation.css";

function Navigation(props: {
  textColor: string;
  minYear: number;
  maxYear: number;
}) {
  const itemsPerLine = 8;
  const items = [];

  let pos = 0;
  let year = props.maxYear;

  let style = { color: props.textColor };

  while (year >= props.minYear) {
    if (pos > 0) {
      let spacer_key = year + "_spacer";
      if (pos % itemsPerLine === 0) {
        items.push(<br key={spacer_key} />);
      } else {
        items.push(
          <span className="spacer" key={spacer_key} style={style}> | </span>
        );
      }
    }

    // TODO: Add event handler to log which year is clicked.
    let link = "#/" + year;
    items.push(
      <a href={link} key={year} style={style}>
        {year}
      </a>
    );

    pos++;
    year--;
  }
  return <div className="Navigation">{items}</div>;
}

export default Navigation;
