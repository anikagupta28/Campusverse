import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import CampusBot from "./pages/CampusBot";
import Campus360 from "./pages/Campus360";
import Notex from "./pages/Notex";
import RiseWall from "./pages/RiseWall";
import TalkNest from "./pages/TalkNest";
import Alumni from "./pages/Alumni";
import Reviews from "./pages/Reviews";

// Admin imports
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminNotices from "./pages/admin/AdminNotices";
import AdminAlumni from "./pages/admin/AdminAlumni";
import AdminRiseWall from "./pages/admin/AdminRiseWall";
import AdminTalkNest from "./pages/admin/AdminTalkNest";
import AdminReviews from "./pages/admin/AdminReviews";

export default function App() {
  return (
    <Routes>

      {/* ── USER SIDE ── */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/campusbot" element={<CampusBot />} />
        <Route path="/360" element={<Campus360 />} />
        <Route path="/notex"    element={<ProtectedRoute><Notex /></ProtectedRoute>} />
        <Route path="/risewall" element={<ProtectedRoute><RiseWall /></ProtectedRoute>} />
        <Route path="/talknest" element={<ProtectedRoute><TalkNest /></ProtectedRoute>} />
        <Route path="/alumni"   element={<Alumni />} />
        <Route path="/reviews"  element={<Reviews />} />
      </Route>

      {/* ── ADMIN LOGIN ── */}
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* ── ADMIN PANEL ── */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="notices"  element={<AdminNotices />} />
        <Route path="alumni"   element={<AdminAlumni />} />
        <Route path="risewall" element={<AdminRiseWall />} />
        <Route path="talknest" element={<AdminTalkNest />} />
        <Route path="reviews"  element={<AdminReviews />} />
      </Route>

    </Routes>
  );
}
