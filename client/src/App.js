import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; 
const routes = [
  {
    path: "/",
    exact: true,
    element: <Home />,
    private: true,
  },
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
