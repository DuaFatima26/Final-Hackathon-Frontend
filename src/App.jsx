import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import ProfileForm from "./components/ProfileForm";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthForm />} />
      <Route path="/profile" element={<ProfileForm />} />
    </Routes>
  );
}
