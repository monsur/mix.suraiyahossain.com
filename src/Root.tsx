import { useEffect } from 'react';
import { useLoaderData } from "react-router-dom";
import { YearData } from "./Types";
import AlbumArt from "./AlbumArt";

function Root() {
  const data = useLoaderData() as YearData;

  useEffect(() => {
    document.title = data.title;
  }, []);

  return (
    <AlbumArt data={data} />
  );
}

export default Root;
