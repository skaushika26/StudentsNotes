import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/notes" element={<NotesList />} />
      <Route path="/notes/new" element={<NoteEditor />} />
      <Route path="/notes/:id" element={<NoteEditor />} />
    </Routes>
  );
}

export  default App;