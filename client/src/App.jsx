import { Route, Routes } from "react-router-dom";
import "./App.css";
import Headers from "./coponenets/Headers";
import OAuth from "./coponenets/OAuth";
import Home from "./pages/Home";
import Chats from "./pages/Chats";
import PrivateRoute from "./coponenets/PrivateRoute";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Headers />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<OAuth />}></Route>
        <Route element={<PrivateRoute />}>
          <Route path="/chat-section" element={<Chats />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
