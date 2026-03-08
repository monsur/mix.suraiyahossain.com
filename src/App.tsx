import Root from "./Root";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Globals from "./Globals";
import Loader from "./Loader";
import { RouteErrorFallback } from "./ErrorFallback";

function getYear(queryStr: string | undefined): number {
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
}

const loader = new Loader();

function ThrowOnRender(): never {
  throw new Error("Test: Route render error from ThrowOnRender");
}

const devRoutes = import.meta.env.DEV
  ? [{ path: "/test-route-error", element: <ThrowOnRender />, errorElement: <RouteErrorFallback /> }]
  : [];

const router = createHashRouter([
  ...devRoutes,
  {
    path: "/shuffle",
    element: <Root />,
    errorElement: <RouteErrorFallback />,
    loader: async () => {
      return loader.loadAll(true);
    },
  },
  {
    path: "/*",
    element: <Root />,
    errorElement: <RouteErrorFallback />,
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
