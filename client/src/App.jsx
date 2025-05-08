import Login from "./pages/login"
import Register from "./pages/register"
import Main from "./pages/main"
import Calls from "./pages/calls"
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function App() {


  const ProtectedRoute = ({ children, isAuthRoute }) => {
    const token = Cookies.get('token');
    if (isAuthRoute && token) {
      return <Navigate to="/main" />;
    }
    if (!isAuthRoute && !token) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <ProtectedRoute isAuthRoute={true}>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute isAuthRoute={true}>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthRoute={false}>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path="/main"
            element={
              <ProtectedRoute isAuthRoute={false}>
                <Main />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calls"
            element={
              <ProtectedRoute isAuthRoute={false}>
                <Calls />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
