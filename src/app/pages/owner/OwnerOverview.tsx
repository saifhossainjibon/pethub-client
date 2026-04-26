import { useState, useEffect } from "react";
import { Calendar, Heart, Bell, FileText, TrendingUp, Clock, CheckCircle2, AlertCircle, X } from "lucide-react";

type Pet = {
  _id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  weight: string;
  image?: string;
  color: string;
  vaccinated: boolean;
  ownerId: string;
  ownerName: string;
  ownerContact: string;
  lastCheckup?: string;
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

type Reminder = {
  _id: string;
  type: string;
  petName: string;
  dueDate: string;
  time: string;
  doctorName: string;
  clinicName: string;
  appointmentType: string;
  ownerId: string;
  status: string;
};

const StatCard = ({
  icon, label, value, sub, color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`${color} p-3.5 rounded-2xl`}>{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

export default function OwnerOverview() {
  const [myPets, setMyPets] = useState<Pet[]>([]);
  const [myAppts, setMyAppts] = useState<Appointment[]>([]);
  const [myReminders, setMyReminders] = useState<Reminder[]>([]);
  const [myRecords, setMyRecords] = useState<MedicalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("Ayesha");

  const API_URL = 'https://pet-care-server-one.vercel.app';
  const OWNER_ID = "user_001";

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchPets(),
        fetchAppointments(),
        fetchMedicalRecords(),
        fetchReminders()
      ]);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPets = async () => {
    try {
      const response = await fetch(`${API_URL}/pets`);
      if (!response.ok) throw new Error('Failed to fetch pets');
      const data = await response.json();
      const userPets = data.filter((p: Pet) => p.ownerId === OWNER_ID);
      setMyPets(userPets);
      
      // Get user name from first pet
      if (userPets.length > 0 && userPets[0].ownerName) {
        const firstName = userPets[0].ownerName.split(' ')[0];
        setUserName(firstName);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${API_URL}/appointments`);
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      const userAppointments = data.filter((a: Appointment) => a.ownerId === OWNER_ID);
      setMyAppts(userAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      const response = await fetch(`${API_URL}/medical-records`);
      if (!response.ok) throw new Error('Failed to fetch medical records');
      const data = await response.json();
      const userRecords = data.filter((r: MedicalRecord) => r.ownerId === OWNER_ID);
      setMyRecords(userRecords);
    } catch (error) {
      console.error('Error fetching medical records:', error);
    }
  };

  const fetchReminders = async () => {
    try {
      // Reminders come from appointments that are pending/accepted
      const response = await fetch(`${API_URL}/appointments`);
      if (!response.ok) throw new Error('Failed to fetch reminders');
      const data = await response.json();
      const userAppointments = data.filter((a: Appointment) => a.ownerId === OWNER_ID);
      
      // Convert upcoming appointments to reminders
      const upcomingReminders: Reminder[] = userAppointments
        .filter((a: Appointment) => a.status === "Pending" || a.status === "Accepted")
        .map((a: Appointment) => ({
          _id: a._id,
          type: a.type === "Online Consultation" ? "Checkup" : "Checkup",
          petName: a.petName,
          dueDate: a.date,
          time: a.time,
          doctorName: a.doctorName,
          clinicName: a.clinicName,
          appointmentType: a.type,
          ownerId: a.ownerId,
          status: a.status
        }));
      
      setMyReminders(upcomingReminders);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const upcoming = myAppts.filter((a) => a.status === "Accepted" || a.status === "Pending");
  const previous = myAppts.filter((a) => a.status === "Visited");

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

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

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{getGreeting()}, Ayesha! 👋</h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your pets today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Heart className="w-6 h-6 text-emerald-600" />}
          label="My Pets"
          value={myPets.length}
          sub="Active pets registered"
          color="bg-emerald-50"
        />
        <StatCard
          icon={<Calendar className="w-6 h-6 text-blue-600" />}
          label="Upcoming Appointments"
          value={upcoming.length}
          sub="Scheduled this month"
          color="bg-blue-50"
        />
        <StatCard
          icon={<FileText className="w-6 h-6 text-purple-600" />}
          label="Medical Records"
          value={myRecords.length}
          sub="Total consultations"
          color="bg-purple-50"
        />
        <StatCard
          icon={<Bell className="w-6 h-6 text-orange-600" />}
          label="Reminders"
          value={myReminders.length}
          sub="Upcoming vaccinations"
          color="bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">Upcoming Appointments</h2>
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
              {upcoming.length} scheduled
            </span>
          </div>
          {upcoming.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.slice(0, 5).map((appt) => (
                <div key={appt._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <div className="bg-blue-100 p-2.5 rounded-xl flex-shrink-0">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{appt.petName} - {appt.reason}</p>
                    <p className="text-xs text-gray-500">{appt.doctorName} · {appt.clinicName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-gray-700">{appt.date}</p>
                    <p className="text-xs text-gray-500">{appt.time}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${
                    appt.status === "Accepted"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {appt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Pets Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-5">My Pets</h2>
          <div className="space-y-4">
            {myPets.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Heart className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p>No pets registered</p>
              </div>
            ) : (
              myPets.map((pet) => (
                <div key={pet._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <img
                    src={pet.image || "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop"}
                    alt={pet.name}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{pet.name}</p>
                    <p className="text-xs text-gray-500">{pet.breed} · {pet.age}y</p>
                    <div className="flex items-center gap-1 mt-1">
                      {pet.vaccinated ? (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Vaccinated
                        </span>
                      ) : (
                        <span className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Not Vaccinated
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Medical Records with View Modal */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-5">Recent Medical Records</h2>
          <div className="space-y-3">
            {myRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p>No medical records found</p>
              </div>
            ) : (
              myRecords.slice(0, 3).map((rec) => (
                <div key={rec._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="bg-purple-100 p-2.5 rounded-xl flex-shrink-0">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{rec.type} – {rec.petName}</p>
                    <p className="text-xs text-gray-500">{rec.doctorName} · {rec.date}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedRecord(rec)}
                    className="text-xs text-teal-600 font-medium hover:underline cursor-pointer flex-shrink-0"
                  >
                    View
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reminders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-5">Upcoming Reminders</h2>
          <div className="space-y-3">
            {myReminders.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p>No upcoming reminders</p>
              </div>
            ) : (
              myReminders.slice(0, 3).map((rem) => (
                <div key={rem._id} className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Bell className="w-4 h-4 text-orange-500" />
                    <p className="text-sm font-semibold text-gray-900">{rem.type} – {rem.petName}</p>
                  </div>
                  <p className="text-xs text-gray-500 ml-6">{rem.dueDate} · {rem.time}</p>
                  <p className="text-xs text-gray-500 ml-6">{rem.doctorName}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Medical Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2.5 rounded-xl">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">Medical Record Details</h2>
                  <p className="text-sm text-gray-500">{selectedRecord.date}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedRecord(null)} 
                className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Pet & Doctor Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Pet Name</p>
                  <p className="font-semibold text-gray-900">{selectedRecord.petName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Pet ID</p>
                  <p className="font-semibold text-gray-900 text-xs font-mono">{selectedRecord.petId}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Doctor</p>
                  <p className="font-semibold text-gray-900">{selectedRecord.doctorName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Clinic</p>
                  <p className="font-semibold text-gray-900">{selectedRecord.clinicName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Visit Type</p>
                  <p className="font-semibold text-gray-900">{selectedRecord.type}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Owner Contact</p>
                  <p className="font-semibold text-gray-900">{selectedRecord.ownerContact || 'N/A'}</p>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-xs text-blue-600 font-medium mb-1">Diagnosis</p>
                <p className="text-gray-900">{selectedRecord.diagnosis}</p>
              </div>

              {/* Prescription */}
              <div className="bg-emerald-50 p-4 rounded-xl">
                <p className="text-xs text-emerald-600 font-medium mb-1">Prescription</p>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedRecord.prescription}</p>
              </div>

              {/* Notes */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500 font-medium mb-1">Doctor's Notes</p>
                <p className="text-gray-700">{selectedRecord.notes || 'No additional notes'}</p>
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-3 sticky bottom-0 bg-white border-t border-gray-100">
              <button
                onClick={() => setSelectedRecord(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  // Create download content
                  const content = `
========================================
        MEDICAL PRESCRIPTION
========================================

Date: ${selectedRecord.date}
Record ID: ${selectedRecord._id}

----------------------------------------
PET INFORMATION
----------------------------------------
Pet Name: ${selectedRecord.petName}
Pet ID: ${selectedRecord.petId}

----------------------------------------
DOCTOR INFORMATION
----------------------------------------
Doctor Name: ${selectedRecord.doctorName}
Clinic: ${selectedRecord.clinicName}

----------------------------------------
VISIT DETAILS
----------------------------------------
Visit Type: ${selectedRecord.type}
Diagnosis: ${selectedRecord.diagnosis}

----------------------------------------
PRESCRIPTION
----------------------------------------
${selectedRecord.prescription}

----------------------------------------
DOCTOR'S NOTES
----------------------------------------
${selectedRecord.notes || 'No additional notes'}

========================================
                  `;
                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `prescription_${selectedRecord.petName}_${selectedRecord.date}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium cursor-pointer transition flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" /> Download Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}