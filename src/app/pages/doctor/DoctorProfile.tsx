import { useState, useEffect } from "react";
import { Edit2, Save, X, Phone, Mail, Clock, DollarSign, Download, Filter } from "lucide-react";

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

type DoctorForm = {
  name: string;
  email: string;
  phone: string;
  timing: string;
  fee: number;
  specialties: string[];
  image: string;
  clinicName: string;
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

// Default form values
const defaultForm: DoctorForm = {
  name: "",
  email: "",
  phone: "",
  timing: "",
  fee: 0,
  specialties: [],
  image: "",
  clinicName: "",
};

export default function DoctorProfile() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<DoctorForm>(defaultForm);
  const [saved, setSaved] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  const API_URL = 'https://pet-care-server-one.vercel.app';
  const DOCTOR_ID = "69ece309c34e8bfcaadbde22";

  useEffect(() => {
    fetchDoctorData();
    fetchMedicalRecords();
  }, []);

  const fetchDoctorData = async () => {
    try {
      const response = await fetch(`${API_URL}/doctors`);
      if (!response.ok) throw new Error('Failed to fetch doctors');
      const data = await response.json();
      const currentDoctor = data.find((d: Doctor) => d._id === DOCTOR_ID);
      
      if (currentDoctor) {
        setDoctor(currentDoctor);
        // Initialize form with doctor data
        setForm({
          name: currentDoctor.name || "",
          email: currentDoctor.email || "",
          phone: currentDoctor.phone || "",
          timing: currentDoctor.timing || "",
          fee: currentDoctor.fee || 0,
          specialties: currentDoctor.specialties || [],
          image: currentDoctor.image || "",
          clinicName: currentDoctor.clinicName || "",
        });
      }
    } catch (error) {
      console.error('Error fetching doctor:', error);
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      const response = await fetch(`${API_URL}/medical-records`);
      if (!response.ok) throw new Error('Failed to fetch medical records');
      const data = await response.json();
      const doctorRecords = data.filter((r: MedicalRecord) => r.doctorId === DOCTOR_ID);
      setRecords(doctorRecords);
    } catch (error) {
      console.error('Error fetching medical records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!doctor) return;
    
    setEditing(false);
    
    try {
      const response = await fetch(`${API_URL}/doctors/${doctor._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) throw new Error('Failed to update doctor');
      
      const updatedDoctor = await response.json();
      setDoctor(updatedDoctor);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error updating doctor:', error);
      alert('Failed to update profile');
    }
  };

  const downloadPrescription = async (record: MedicalRecord) => {
    setDownloading(record._id);
    
    const content = `
========================================
        MEDICAL PRESCRIPTION
========================================

Date: ${record.date}
Record ID: ${record._id}

----------------------------------------
PET INFORMATION
----------------------------------------
Pet Name: ${record.petName}
Pet ID: ${record.petId}

----------------------------------------
DOCTOR INFORMATION
----------------------------------------
Doctor Name: ${record.doctorName}
Doctor ID: ${record.doctorId}
Clinic: ${record.clinicName}

----------------------------------------
VISIT DETAILS
----------------------------------------
Visit Type: ${record.type || 'Consultation'}
Diagnosis: ${record.diagnosis}

----------------------------------------
PRESCRIPTION
----------------------------------------
${record.prescription}

----------------------------------------
DOCTOR'S NOTES
----------------------------------------
${record.notes || 'No additional notes'}

----------------------------------------
This is a computer-generated document.
For any queries, please contact the clinic.
========================================
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescription_${record.petName}_${record.date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setDownloading(null);
  };

  const filteredRecords = records.filter((r) => !dateFilter || r.date === dateFilter);

  if (loading || !doctor) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-1">Manage your professional information</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium cursor-pointer transition">
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => { setEditing(false); setForm({ ...doctor }); }} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium cursor-pointer">
              <X className="w-4 h-4" /> Cancel
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium cursor-pointer transition">
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        )}
      </div>

      {saved && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          ✓ Profile updated successfully!
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
        <div className="h-28 bg-gradient-to-r from-purple-500 to-violet-600 relative" />
        
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col gap-4 -mt-14 mb-5">
            <div className="w-20 h-20 rounded-2xl border-4 border-white overflow-hidden shadow-lg flex-shrink-0 bg-white">
              <img 
                src={form.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtG1p64yArRQ6LXyz5LYPcKXnMIi64OGmbnA&s"} 
                alt={form.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="pb-2">
              {editing ? (
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="text-xl font-bold text-gray-900 border-b-2 border-purple-400 focus:outline-none bg-transparent"
                />
              ) : (
                <h2 className="text-xl font-bold text-gray-900">{doctor.name}</h2>
              )}
              <p className="text-gray-500 text-sm">{doctor.clinicName}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Email", field: "email", icon: <Mail className="w-4 h-4 text-gray-400" /> },
              { label: "Phone", field: "phone", icon: <Phone className="w-4 h-4 text-gray-400" /> },
              { label: "Timing", field: "timing", icon: <Clock className="w-4 h-4 text-gray-400" /> },
            ].map(({ label, field, icon }) => (
              <div key={field}>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
                {editing ? (
                  <input
                    value={form[field as keyof DoctorForm] as string}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                    {icon}
                    <span className="text-sm text-gray-900">{doctor[field as keyof Doctor] || 'N/A'}</span>
                  </div>
                )}
              </div>
            ))}

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Consultation Fee</label>
              {editing ? (
                <input
                  type="number"
                  value={form.fee}
                  onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">${doctor.fee} per visit</span>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Specialties</label>
              {editing ? (
                <input
                  value={form.specialties.join(", ")}
                  onChange={(e) => setForm({ ...form, specialties: e.target.value.split(",").map(s => s.trim()) })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl">
                  {doctor.specialties?.map((s) => (
                    <span key={s} className="bg-purple-50 text-purple-600 text-xs font-medium px-2.5 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Consultation History */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <h2 className="font-bold text-gray-900">Consultation History</h2>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {dateFilter && (
              <button onClick={() => setDateFilter("")} className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Pet ID</th>
                <th className="pb-3 pr-4">Pet Name</th>
                <th className="pb-3 pr-4">Owner Contact</th>
                <th className="pb-3">Prescription</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRecords.map((rec) => (
                <tr key={rec._id} className="hover:bg-gray-50">
                  <td className="py-3 pr-4 text-sm text-gray-600">{rec.date}</td>
                  <td className="py-3 pr-4 text-xs font-mono text-gray-500">{rec.petId}</td>
                  <td className="py-3 pr-4 text-sm font-medium text-gray-900">{rec.petName}</td>
                  <td className="py-3 pr-4 text-sm text-gray-600">{rec.ownerContact || 'N/A'}</td>
                  <td className="py-3">
                    <button 
                      onClick={() => downloadPrescription(rec)}
                      disabled={downloading === rec._id}
                      className="flex items-center gap-1.5 text-xs text-blue-600 font-medium hover:underline cursor-pointer disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" /> 
                      {downloading === rec._id ? 'Downloading...' : 'Download'}
                    </button>
                   </td>
                 </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400 text-sm">No records found</td>
                </tr>
              )}
            </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}