import { useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { YearData } from "./Types";
import AlbumArt from "./AlbumArt";
import Navigation from "./Navigation";
import Globals from "./Globals";

function Root() {
  const data = useLoaderData() as YearData;

  useEffect(() => {
    document.title = data.title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <AlbumArt data={data} />
      <Navigation
        minYear={Globals.MIN_YEAR}
        maxYear={Globals.MAX_YEAR}
      ></Navigation>
    </div>
  );
}

export default Root;
