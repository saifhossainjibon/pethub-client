import { useState, useEffect } from "react";
import { Calendar, Users, Heart, FileText, TrendingUp, CheckCircle2, Clock, XCircle } from "lucide-react";

type Clinic = {
  _id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
  timing: string;
  services: string[];
  email?: string;
  phone?: string;
};

type Appointment = {
  _id: string;
  type: string;
  petId: string;
  petName: string;
  doctorId: string;
  doctorName: string;
  clinicId: string;
  clinicName: string;
  date: string;
  time: string;
  reason: string;
  ownerId: string;
  ownerName?: string;
  ownerContact?: string;
  status: string;
  createdAt?: string;
};

type Doctor = {
  _id: string;
  name: string;
  image: string;
  email: string;
  phone: string;
  clinicId: string;
  clinicName: string;
  specialties: string[];
  timing: string;
  fee: number;
  bio: string;
};

export default function ClinicDashboard() {
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [todayAppts, setTodayAppts] = useState<Appointment[]>([]);
  const [allAppts, setAllAppts] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'https://pet-care-server-one.vercel.app';
  const CLINIC_ID = "clinic_1777198034685";
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchClinic(),
        fetchAppointments(),
        fetchDoctors()
      ]);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const fetchClinic = async () => {
    try {
      const response = await fetch(`${API_URL}/clinics`);
      if (!response.ok) throw new Error('Failed to fetch clinics');
      const data = await response.json();
      const currentClinic = data.find((c: Clinic) => c._id === CLINIC_ID);
      
      if (currentClinic) {
        setClinic(currentClinic);
      } else if (data.length > 0) {
        // Fallback to first clinic
        setClinic(data[0]);
      }
    } catch (error) {
      console.error('Error fetching clinic:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${API_URL}/appointments`);
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      
      // Filter appointments for this clinic
      const clinicAppointments = data.filter((a: Appointment) => a.clinicId === CLINIC_ID);
      setAllAppts(clinicAppointments);
      
      // Filter today's appointments
      const todays = clinicAppointments.filter((a: Appointment) => a.date === today);
      setTodayAppts(todays);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${API_URL}/doctors`);
      if (!response.ok) throw new Error('Failed to fetch doctors');
      const data = await response.json();
      
      // Filter doctors for this clinic
      const clinicDoctors = data.filter((d: Doctor) => d.clinicId === CLINIC_ID);
      setDoctors(clinicDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const visited = allAppts.filter((a) => a.status === "Visited");
  const accepted = allAppts.filter((a) => a.status === "Accepted");
  const pending = allAppts.filter((a) => a.status === "Pending");

  // Format today's date for display
  const formattedToday = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const stats = [
    { 
      label: "Today's Appointments", 
      value: todayAppts.length, 
      icon: <Clock className="w-6 h-6 text-blue-600" />, 
      color: "bg-blue-50", 
      trend: todayAppts.length > 0 ? `${todayAppts.length} scheduled today` : "No appointments today" 
    },
    { 
      label: "Available Doctors", 
      value: doctors.length, 
      icon: <Users className="w-6 h-6 text-purple-600" />, 
      color: "bg-purple-50", 
      trend: doctors.length === 1 ? "1 doctor available" : `${doctors.length} doctors available` 
    },
    { 
      label: "Total Appointments", 
      value: allAppts.length, 
      icon: <Calendar className="w-6 h-6 text-teal-600" />, 
      color: "bg-teal-50", 
      trend: "All time" 
    },
    { 
      label: "Completed Visits", 
      value: visited.length, 
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />, 
      color: "bg-emerald-50", 
      trend: "Lifetime" 
    },
  ];

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !clinic) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Dashboard</h2>
          <p className="text-red-600 mb-4">{error || "Clinic not found"}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-5 mb-8">
        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
          <img 
            src={clinic.image || "https://images.unsplash.com/photo-1629909613654-28e377c37b1a?w=100&h=100&fit=crop"} 
            alt={clinic.name} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{clinic.name}</h1>
          <p className="text-gray-500">{clinic.location}</p>
          <div className="flex items-center gap-2 mt-1">
          
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500">{clinic.timing || "9:00 AM - 9:00 PM"}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`${stat.color} p-3.5 rounded-2xl`}>{stat.icon}</div>
            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-5">Today's Appointments ({formattedToday})</h2>
          {todayAppts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No appointments today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppts.map((appt) => (
                <div key={appt._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 text-sm">{appt.petName}</p>
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{appt.type}</span>
                    </div>
                    <p className="text-xs text-gray-500">{appt.ownerName || 'Owner'} · {appt.ownerContact || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{appt.doctorName} · {appt.time}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    appt.status === "Accepted" ? "bg-green-100 text-green-700" :
                    appt.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {appt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Doctors */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-5">Available Doctors</h2>
          <div className="space-y-4">
            {doctors.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>No doctors found</p>
              </div>
            ) : (
              doctors.map((doc) => (
                <div key={doc._id} className="flex items-center gap-3">
                  <img 
                    src={doc.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop"} 
                    alt={doc.name} 
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{doc.name}</p>
                    <p className="text-xs text-gray-500 truncate">{doc.specialties?.join(", ") || "General"}</p>
                    <p className="text-xs text-teal-600 font-medium">${doc.fee}/visit</p>
                  </div>
                  <span className="w-2.5 h-2.5 bg-green-400 rounded-full flex-shrink-0" title="Available" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Services Offered</h2>
          <div className="flex flex-wrap gap-2">
            {clinic.services && clinic.services.length > 0 ? (
              clinic.services.map((s) => (
                <span key={s} className="bg-teal-50 text-teal-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  {s}
                </span>
              ))
            ) : (
              <div className="text-center py-4 text-gray-400 w-full">
                <p>No services listed</p>
              </div>
            )}
          </div>
        </div>

        {/* Appointment Status */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Appointment Summary</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <div className="flex justify-center mb-2"><CheckCircle2 className="w-5 h-5 text-green-700" /></div>
              <p className="text-2xl font-bold text-green-700">{accepted.length}</p>
              <p className="text-xs font-medium text-green-600">Accepted</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl text-center">
              <div className="flex justify-center mb-2"><Clock className="w-5 h-5 text-yellow-700" /></div>
              <p className="text-2xl font-bold text-yellow-700">{pending.length}</p>
              <p className="text-xs font-medium text-yellow-600">Pending</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <div className="flex justify-center mb-2"><TrendingUp className="w-5 h-5 text-blue-700" /></div>
              <p className="text-2xl font-bold text-blue-700">{visited.length}</p>
              <p className="text-xs font-medium text-blue-600">Visited</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}