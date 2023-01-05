import Root from "./Root";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Globals from "./Globals";
import Loader from "./Loader";

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

const loader = new Loader();

const router = createHashRouter([
  {
    path: "/shuffle",
    element: <Root />,
    loader: async () => {
      return loader.loadAll(true);
    },
  },
  {
    path: "/*",
    element: <Root />,
    loader: async ({ params }) => {
      const year = getYear(params["*"]);
      return loader.loadYear(year);
    },
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
