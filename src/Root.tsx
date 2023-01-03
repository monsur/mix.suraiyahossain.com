import { useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { YearData } from "./Types";
import AlbumArt from "./AlbumArt";

function Root() {
  const data = useLoaderData() as YearData;

  useEffect(() => {
    document.title = data.title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <AlbumArt data={data} />;
}

export default Root;
