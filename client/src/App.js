import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; 
import Demo from "./pages/Demo";
import Demo2 from "./pages/Demo2";
const routes = [
  {
    path: "/",
    exact: true,
    element: <Home />,
    private: true,
  },
  {
    path : "/demo",
    exact: true,
    element: <Demo2 />,
    private: true,
  }
];
function App() {
  return (
    <BrowserRouter>
      <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
    </BrowserRouter>
  );
}

export default App;
