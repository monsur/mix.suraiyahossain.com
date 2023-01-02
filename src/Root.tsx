import React, { useEffect } from 'react';
import { useLoaderData } from "react-router-dom";

interface YearData {
  title: string
};

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
