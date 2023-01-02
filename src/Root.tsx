import { useLoaderData } from "react-router-dom";

interface YearData {
  title: string
};

function Root() {
  const data = useLoaderData() as YearData;

  return (
    <div>{data.title}</div>
  );
}

export default Root;
