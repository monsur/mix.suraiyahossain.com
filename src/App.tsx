import './App.css';
import Root from './Root';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const MIN_YEAR = 2007;
const MAX_YEAR = 2022;

const getYear = (queryStr : string|undefined) => {
  if (!queryStr) {
    return MAX_YEAR;
  }
  const parsed = parseInt(queryStr);
  if (isNaN(parsed)) {
    return MAX_YEAR;
  }
  if (parsed < MIN_YEAR || parsed > MAX_YEAR) {
    return MAX_YEAR;
  }
  return parsed;
};

const router = createBrowserRouter([
  {
    path: "/*",
    element: <Root />,
    loader: async ({ params }) => {
      const year = getYear(params["*"]);
      return fetch(`${process.env.PUBLIC_URL}/years/${year}/data.json`);
    },
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
