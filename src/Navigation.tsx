function Navigation(props: { minYear: number; maxYear: number }) {
  const items = [];
  let year = props.maxYear;
  while (year >= props.minYear) {
    items.push(<div key={year}>{year}</div>);
    year--;
  }
  return <div>{items}</div>;
}

export default Navigation;
