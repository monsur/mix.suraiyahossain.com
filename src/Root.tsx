import React, { useEffect } from 'react';
import { useLoaderData } from "react-router-dom";
import { YearData } from "./Types";

function Root() {
  const data = useLoaderData() as YearData;

  useEffect(() => {
    document.title = data.title;
  });

  return (
    <div>{data.title}</div>
  );
}

export default Root;
