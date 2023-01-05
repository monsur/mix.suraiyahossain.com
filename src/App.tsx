import Root from "./Root";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Globals from "./Globals";

const getYear = (queryStr: string | undefined) => {
  if (!queryStr) {
    return Globals.MAX_YEAR;
  }
  const parsed = parseInt(queryStr);
  if (isNaN(parsed)) {
    return Globals.MAX_YEAR;
  }
  if (parsed < Globals.MIN_YEAR || parsed > Globals.MAX_YEAR) {
    return Globals.MAX_YEAR;
  }
  return parsed;
};

function App() {
  const router = createHashRouter([
    {
      path: "/*",
      element: <Root />,
      loader: async ({ params }) => {
        const year = getYear(params["*"]);
        return fetch(`/years/${year}/data.json`);
      },
    },
  ]);
  
    return <RouterProvider router={router} />;
}

export default App;
