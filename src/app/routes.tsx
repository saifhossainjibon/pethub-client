import { createBrowserRouter, Navigate } from "react-router";

import Login from "./pages/Login";
import DashboardLayout from "./components/layout/DashboardLayout";

// Owner pages
import OwnerOverview from "./pages/owner/OwnerOverview";
import OwnerAppointments from "./pages/owner/OwnerAppointments";
import OwnerMedicalRecords from "./pages/owner/OwnerMedicalRecords";
import OwnerMyPets from "./pages/owner/OwnerMyPets";
import OwnerReminders from "./pages/owner/OwnerReminders";
import OwnerProfile from "./pages/owner/OwnerProfile";

// Clinic pages
import ClinicDashboard from "./pages/clinic/ClinicDashboard";
import ClinicDetails from "./pages/clinic/ClinicDetails";
import ClinicAppointments from "./pages/clinic/ClinicAppointments";
import ClinicDoctors from "./pages/clinic/ClinicDoctors";
import ClinicPets from "./pages/clinic/ClinicPets";

// Doctor pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorPetHistory from "./pages/doctor/DoctorPetHistory";
import DoctorProfile from "./pages/doctor/DoctorProfile";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminClinics from "./pages/admin/AdminClinics";
import AdminPetHistory from "./pages/admin/AdminPetHistory";
import AdminDoctors from "./pages/admin/AdminDoctors";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  // Owner routes
  {
    path: "/owner",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <OwnerOverview /> },
      { path: "appointments", element: <OwnerAppointments /> },
      { path: "medical-records", element: <OwnerMedicalRecords /> },
      { path: "my-pets", element: <OwnerMyPets /> },
      { path: "reminders", element: <OwnerReminders /> },
      { path: "profile", element: <OwnerProfile /> },
    ],
  },
  // Clinic routes
  {
    path: "/clinic",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <ClinicDashboard /> },
      { path: "details", element: <ClinicDetails /> },
      { path: "appointments", element: <ClinicAppointments /> },
      { path: "doctors", element: <ClinicDoctors /> },
      { path: "pets", element: <ClinicPets /> },
    ],
  },
  // Doctor routes
  {
    path: "/doctor",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DoctorDashboard /> },
      { path: "appointments", element: <DoctorAppointments /> },
      { path: "pet-history", element: <DoctorPetHistory /> },
      { path: "profile", element: <DoctorProfile /> },
    ],
  },
  // Admin routes
  {
    path: "/admin",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "clinics", element: <AdminClinics /> },
      { path: "pet-history", element: <AdminPetHistory /> },
      { path: "doctors", element: <AdminDoctors /> },
    ],
  },
  // Catch-all
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
