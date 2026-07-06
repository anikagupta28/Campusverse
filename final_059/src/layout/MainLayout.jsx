import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoginModal from "../components/LoginModal";
import "../layout/MainLayout.css";

export default function MainLayout() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <Navbar onLoginClick={() => setLoginOpen(true)} />

      <main className="content">
        <Outlet />
      </main>

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
      />

      <Footer />
    </>
  );
}
