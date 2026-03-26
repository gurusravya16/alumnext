import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/protectedroute";
import DashboardRoleRedirect from "./components/DashboardRoleRedirect";

import Landing from "./pages/Landing";
import Login from "./pages/login";
import StudentSignup from "./pages/StudentSignup";
import AlumniSignup from "./pages/AlumniSignup";
import PendingApproval from "./pages/PendingApproval";

import Posts from "./pages/Posts";
import DashboardHome from "./pages/DashboardHome";
import DashboardAlumni from "./pages/DashboardAlumni";
import DashboardAlumniProfile from "./pages/DashboardAlumniProfile";
import DashboardMentorship from "./pages/DashboardMentorship";
import DashboardProfile from "./pages/DashboardProfile";

import AlumniDashboardLayout from "./components/dashboard/AlumniDashboardLayout";
import AlumniHome from "./pages/alumni/AlumniHome";
import AlumniPostAdvertisement from "./pages/alumni/AlumniPostAdvertisement";
import AlumniProfile from "./pages/alumni/AlumniProfile";
import AlumniSettings from "./pages/alumni/AlumniSettings";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Layout />}>
        <Route index element={<Login />} />
      </Route>
      <Route path="/signup" element={<Layout />}>
        <Route index element={<StudentSignup />} />
      </Route>
      <Route path="/signup/student" element={<Layout />}>
        <Route index element={<StudentSignup />} />
      </Route>
      <Route path="/signup/alumni" element={<Layout />}>
        <Route index element={<AlumniSignup />} />
      </Route>
      <Route path="/pending-approval" element={<Layout />}>
        <Route index element={<PendingApproval />} />
      </Route>
      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route index element={<DashboardRoleRedirect />} />

        {/* STUDENT DASHBOARD */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="student" element={<DashboardHome />} />
            <Route path="alumni" element={<DashboardAlumni />} />
            <Route path="alumni/:id" element={<DashboardAlumniProfile />} />
            <Route path="mentorship" element={<DashboardMentorship />} />
            <Route path="profile" element={<DashboardProfile />} />
            <Route path="posts" element={<Posts />} />
          </Route>
        </Route>

        {/* ALUMNI DASHBOARD */}
        <Route element={<ProtectedRoute allowedRoles={["alumni"]} />}>
          <Route element={<AlumniDashboardLayout />}>
            <Route path="alumni-home" element={<AlumniHome />} />
            <Route path="posts" element={<Posts />} />
            <Route path="alumni/post-ad" element={<AlumniPostAdvertisement />} />
            <Route path="alumni/profile" element={<AlumniProfile />} />
            <Route path="alumni/settings" element={<AlumniSettings />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
