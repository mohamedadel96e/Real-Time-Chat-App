import Login from "./pages/login";
import Register from "./pages/register";
import Main from "./pages/main";
import Calls from "./pages/calls";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<Main />} />
          <Route path="/calls" element={<Calls />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
