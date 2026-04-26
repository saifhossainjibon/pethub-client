import { useState, useEffect } from "react";
import { Calendar, FileText, Users, CheckCircle2, Clock, TrendingUp } from "lucide-react";

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

type MedicalRecord = {
  _id: string;
  petId: string;
  petName: string;
  doctorId: string;
  doctorName: string;
  clinicId: string;
  clinicName: string;
  date: string;
  diagnosis: string;
  prescription: string;
  notes: string;
  type: string;
  ownerId: string;
  ownerContact?: string;
  createdAt?: string;
};

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [todayAppts, setTodayAppts] = useState<Appointment[]>([]);
  const [allAppts, setAllAppts] = useState<Appointment[]>([]);
  const [myRecords, setMyRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'https://pet-care-server-one.vercel.app';
  const DOCTOR_ID = "69ece309c34e8bfcaadbde22";
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel
      await Promise.all([
        fetchDoctorData(),
        fetchAppointments(),
        fetchMedicalRecords()
      ]);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorData = async () => {
    try {
      console.log('Fetching doctor data...');
      const response = await fetch(`${API_URL}/doctors`);
      if (!response.ok) throw new Error(`Failed to fetch doctors: ${response.status}`);
      const data = await response.json();
      console.log('Doctors data:', data);
      
      const currentDoctor = data.find((d: Doctor) => d._id === DOCTOR_ID);
      if (currentDoctor) {
        setDoctor(currentDoctor);
        console.log('Doctor found:', currentDoctor);
      } else {
        console.warn('Doctor not found with ID:', DOCTOR_ID);
        // Fallback: use first doctor if available
        if (data.length > 0) {
          setDoctor(data[0]);
          console.log('Using first doctor as fallback:', data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching doctor:', error);
      setError('Failed to load doctor information');
    }
  };

  const fetchAppointments = async () => {
    try {
      console.log('Fetching appointments...');
      const response = await fetch(`${API_URL}/appointments`);
      if (!response.ok) throw new Error(`Failed to fetch appointments: ${response.status}`);
      const data = await response.json();
      console.log('All appointments:', data.length);
      
      // Filter appointments for this doctor
      const doctorAppointments = data.filter((a: Appointment) => a.doctorId === DOCTOR_ID);
      console.log('Doctor appointments:', doctorAppointments.length);
      setAllAppts(doctorAppointments);
      
      // Filter today's appointments
      const todays = doctorAppointments.filter((a: Appointment) => a.date === today);
      console.log('Today\'s appointments:', todays.length);
      setTodayAppts(todays);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments');
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      console.log('Fetching medical records...');
      const response = await fetch(`${API_URL}/medical-records`);
      if (!response.ok) throw new Error(`Failed to fetch medical records: ${response.status}`);
      const data = await response.json();
      console.log('All medical records:', data.length);
      
      // Filter medical records for this doctor
      const doctorRecords = data.filter((r: MedicalRecord) => r.doctorId === DOCTOR_ID);
      console.log('Doctor medical records:', doctorRecords.length);
      setMyRecords(doctorRecords);
    } catch (error) {
      console.error('Error fetching medical records:', error);
      setError('Failed to load medical records');
    }
  };

  const totalAppointments = allAppts.length;
  const completedVisits = allAppts.filter(a => a.status === "Visited").length;
  const acceptedAppointments = allAppts.filter(a => a.status === "Accepted").length;
  const pendingAppointments = allAppts.filter(a => a.status === "Pending").length;
  const inPersonVisits = allAppts.filter(a => a.type === "In-Person Visit").length;
  const onlineConsultations = allAppts.filter(a => a.type === "Online Consultation").length;

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading dashboard...</p>
          <p className="text-xs text-gray-400 mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Dashboard</h2>
          <p className="text-red-600 mb-4">{error}</p>
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

  if (!doctor) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
          <div className="text-yellow-500 text-6xl mb-4">👨‍⚕️</div>
          <h2 className="text-xl font-semibold text-yellow-700 mb-2">Doctor Not Found</h2>
          <p className="text-yellow-600 mb-4">No doctor found with ID: {DOCTOR_ID}</p>
          <p className="text-sm text-gray-500">Please check if doctor exists in the database</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Doctor Header */}
      <div className="flex items-center gap-5 mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <img 
          src={doctor.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop"} 
          alt={doctor.name} 
          className="w-20 h-20 rounded-2xl object-cover shadow" 
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
          <p className="text-gray-500">{doctor.specialties?.join(", ")}</p>
          <p className="text-sm text-gray-400 mt-1">{doctor.clinicName}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {doctor.specialties?.map((s) => (
              <span key={s} className="bg-purple-50 text-purple-600 text-xs font-medium px-2.5 py-1 rounded-full">{s}</span>
            ))}
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-2xl font-bold text-teal-600">{doctor.fee}/-</p>
          <p className="text-xs text-gray-400">per consultation</p>
          <p className="text-xs text-gray-500 mt-1">{doctor.timing}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-50 p-3.5 rounded-2xl text-blue-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Today's Appointments</p>
            <p className="text-2xl font-bold text-gray-900">{todayAppts.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-teal-50 p-3.5 rounded-2xl text-teal-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Appointments</p>
            <p className="text-2xl font-bold text-gray-900">{totalAppointments}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-purple-50 p-3.5 rounded-2xl text-purple-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Medical Records</p>
            <p className="text-2xl font-bold text-gray-900">{myRecords.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-emerald-50 p-3.5 rounded-2xl text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Completed Visits</p>
            <p className="text-2xl font-bold text-gray-900">{completedVisits}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Today's Schedule</h2>
          {todayAppts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No appointments today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppts.map((appt) => (
                <div key={appt._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{appt.petName}</p>
                    <p className="text-xs text-gray-500">{appt.ownerName || 'Owner'} · {appt.time}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    appt.status === "Accepted" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {appt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Consultations */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Recent Consultations</h2>
          <div className="space-y-3">
            {myRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>No consultations yet</p>
              </div>
            ) : (
              myRecords.slice(0, 5).map((rec) => (
                <div key={rec._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{rec.petName}</p>
                    <p className="text-xs text-gray-500">{rec.type} · {rec.date}</p>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">{rec.diagnosis}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats - Appointment Breakdown */}
        {/* <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Appointment Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-blue-700">{inPersonVisits}</p>
              <p className="text-xs font-medium text-blue-600 mt-0.5">In-Person</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-purple-700">{onlineConsultations}</p>
              <p className="text-xs font-medium text-purple-600 mt-0.5">Online</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-green-700">{acceptedAppointments}</p>
              <p className="text-xs font-medium text-green-600 mt-0.5">Accepted</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-yellow-700">{pendingAppointments}</p>
              <p className="text-xs font-medium text-yellow-600 mt-0.5">Pending</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}