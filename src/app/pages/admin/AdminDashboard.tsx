import { useState, useEffect } from "react";
import {
  Building2,
  Stethoscope,
  Heart,
  Calendar,
  Users,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

type Clinic = {
  _id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  totalDoctors: number;
  email?: string;
  phone?: string;
  timing?: string;
  services?: string[];
};

type Doctor = {
  _id: string;
  name: string;
  image: string;
  specialties: string[];
  fee: number;
  clinicName: string;
  email?: string;
  phone?: string;
  timing?: string;
};

type Pet = {
  _id: string;
  name: string;
  ownerId: string;
  ownerName?: string;
  type?: string;
  breed?: string;
  age?: number;
};

type Appointment = {
  _id: string;
  date: string;
  petName: string;
  ownerName: string;
  doctorName: string;
  clinicName: string;
  status: string;
  type?: string;
  time?: string;
  ownerId?: string; // Add this property
  petId?: string; // Add this property if needed
  doctorId?: string; // Add this property if needed
  clinicId?: string; // Add this property if needed
};

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export default function AdminDashboard() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://pet-care-server-one.vercel.app";

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchClinics(),
        fetchDoctors(),
        fetchPets(),
        fetchAppointments(),
        fetchUsers(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClinics = async () => {
    try {
      const response = await fetch(`${API_URL}/clinics`);
      if (!response.ok) throw new Error("Failed to fetch clinics");
      const data = await response.json();
      setClinics(data);
    } catch (error) {
      console.error("Error fetching clinics:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${API_URL}/doctors`);
      if (!response.ok) throw new Error("Failed to fetch doctors");
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchPets = async () => {
    try {
      const response = await fetch(`${API_URL}/pets`);
      if (!response.ok) throw new Error("Failed to fetch pets");
      const data = await response.json();
      setPets(data);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${API_URL}/appointments`);
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/appointments`);
      if (!response.ok) throw new Error("Failed to fetch users data");
      const data: Appointment[] = await response.json();

      // Extract unique users from appointments
      const userMap = new Map<string, User>();

      data.forEach((appointment: Appointment) => {
        if (appointment.ownerName && !userMap.has(appointment.ownerName)) {
          const ownerId =
            appointment.ownerId ||
            `user_${appointment.ownerName.toLowerCase().replace(/\s/g, "_")}`;
          const email = appointment.ownerName
            ? `${appointment.ownerName.toLowerCase().replace(/\s/g, ".")}@email.com`
            : "unknown@email.com";

          userMap.set(appointment.ownerName, {
            _id: ownerId,
            name: appointment.ownerName,
            email: email,
            role: "pet_owner",
          });
        }
      });

      const uniqueUsers = Array.from(userMap.values());
      setUsers(uniqueUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const totalAppointments = appointments.length;
  const completedVisits = appointments.filter(
    (a) => a.status === "Visited",
  ).length;

  const stats = [
    {
      label: "Total Clinics",
      value: clinics.length,
      icon: <Building2 className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-50",
      change: `${clinics.length} registered`,
    },
    {
      label: "Total Doctors",
      value: doctors.length,
      icon: <Stethoscope className="w-6 h-6 text-purple-600" />,
      color: "bg-purple-50",
      change: `${doctors.length} specialists`,
    },
    {
      label: "Registered Pets",
      value: pets.length,
      icon: <Heart className="w-6 h-6 text-rose-600" />,
      color: "bg-rose-50",
      change: `${pets.length} total pets`,
    },
    {
      label: "Total Appointments",
      value: totalAppointments,
      icon: <Calendar className="w-6 h-6 text-teal-600" />,
      color: "bg-teal-50",
      change: "All time",
    },
    {
      label: "Active Users",
      value: users.length,
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      color: "bg-emerald-50",
      change: "All roles",
    },
    {
      label: "Completed Visits",
      value: completedVisits,
      icon: <TrendingUp className="w-6 h-6 text-orange-600" />,
      color: "bg-orange-50",
      change: "Lifetime",
    },
  ];

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-2xl">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            System Administration
          </h1>
          <p className="text-gray-500">PetCare Hub — Control Panel</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4"
          >
            <div className={`${stat.color} p-3.5 rounded-2xl`}>{stat.icon}</div>
            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clinics Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Registered Clinics</h2>
          <div className="space-y-3">
            {clinics.slice(0, 5).map((clinic) => (
              <div
                key={clinic._id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <img
                  src={
                    clinic.image ||
                    "https://images.unsplash.com/photo-1629909613654-28e377c37b1a?w=100&h=100&fit=crop"
                  }
                  alt={clinic.name}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {clinic.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {clinic.location}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                    {clinic.totalDoctors} doctors
                  </span>
                </div>
              </div>
            ))}
            {clinics.length === 0 && (
              <div className="text-center py-4 text-gray-400">
                No clinics found
              </div>
            )}
          </div>
        </div>

        {/* Doctors Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Registered Doctors</h2>
          <div className="space-y-3">
            {doctors.slice(0, 5).map((doc) => (
              <div
                key={doc._id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <img
                  src={
                    doc.image ||
                    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop"
                  }
                  alt={doc.name}
                  className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {doc.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {doc.specialties?.join(", ") || "General"}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-medium text-teal-600">
                    ${doc.fee}/visit
                  </p>
                  <p className="text-xs text-gray-400 truncate max-w-[100px]">
                    {doc.clinicName?.split(" ")[0]}
                  </p>
                </div>
              </div>
            ))}
            {doctors.length === 0 && (
              <div className="text-center py-4 text-gray-400">
                No doctors found
              </div>
            )}
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">
            Recent Appointments (System-wide)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Pet</th>
                  <th className="pb-3 pr-4">Owner</th>
                  <th className="pb-3 pr-4">Doctor</th>
                  <th className="pb-3 pr-4">Clinic</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.slice(0, 6).map((appt) => (
                  <tr key={appt._id} className="hover:bg-gray-50 transition">
                    <td className="py-3 pr-4 text-sm text-gray-600">
                      {appt.date}
                    </td>
                    <td className="py-3 pr-4 text-sm font-medium text-gray-900">
                      {appt.petName}
                    </td>
                    <td className="py-3 pr-4 text-sm text-gray-600">
                      {appt.ownerName}
                    </td>
                    <td className="py-3 pr-4 text-sm text-gray-600">
                      {appt.doctorName}
                    </td>
                    <td className="py-3 pr-4 text-xs text-gray-500">
                      {appt.clinicName}
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          appt.status === "Accepted"
                            ? "bg-green-100 text-green-700"
                            : appt.status === "Visited"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-8 text-gray-400 text-sm"
                    >
                      No appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
