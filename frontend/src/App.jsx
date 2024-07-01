import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./providers";
import { Login } from "./pages/Login/Login";
// import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
