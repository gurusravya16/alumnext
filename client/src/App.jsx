import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/protectedroute";

import Landing from "./pages/Landing";
import Login from "./pages/login";
import StudentSignup from "./pages/StudentSignup";
import AlumniSignup from "./pages/AlumniSignup";
import PendingApproval from "./pages/PendingApproval";

import Posts from "./pages/Posts";
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
        <Route element={<DashboardLayout />}>
          <Route index element={<Posts />} />
          <Route path="posts" element={<Posts />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
