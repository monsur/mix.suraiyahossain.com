import "./Navigation.css";

function Navigation(props: { minYear: number; maxYear: number }) {
  const itemsPerLine = 8;
  const items = [];

  let pos = 0;
  let year = props.maxYear;

  while (year >= props.minYear) {
    if (pos > 0) {
      if (pos % itemsPerLine === 0) {
        items.push(<br />);
      } else {
        items.push(<span className="spacer"> | </span>);
      }
    }

    let link = "#/" + year;
    items.push(
      <a href={link} key={year}>
        {year}
      </a>
    );

    pos++;
    year--;
  }
  return <div className="Navigation">{items}</div>;
}

export default Navigation;
