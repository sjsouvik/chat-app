import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./providers";
import { Login } from "./pages/Login/Login";
import { Chats } from "./pages/Chats/Chats";
import { PrivateRoute } from "./components";
// import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Chats />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
