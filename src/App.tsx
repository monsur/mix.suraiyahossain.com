import './App.css';
import Root from './Root';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const rootLoader = function() {return {};};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
