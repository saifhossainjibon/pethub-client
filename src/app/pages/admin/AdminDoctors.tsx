import { useState, useEffect } from "react";
import { Search, Eye, X, Phone, Mail, Clock, DollarSign, Download, Building2 } from "lucide-react";

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

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [searchId, setSearchId] = useState("");
  const [viewDoctor, setViewDoctor] = useState<Doctor | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  const API_URL = 'https://pet-care-server-one.vercel.app';

  useEffect(() => {
    fetchDoctors();
    fetchMedicalRecords();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${API_URL}/doctors`);
      if (!response.ok) throw new Error('Failed to fetch doctors');
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      const response = await fetch(`${API_URL}/medical-records`);
      if (!response.ok) throw new Error('Failed to fetch medical records');
      const data = await response.json();
      setMedicalRecords(data);
    } catch (error) {
      console.error('Error fetching medical records:', error);
    }
  };

  const handleSearch = () => {
    if (!searchId.trim()) return;
    const doc = doctors.find(
      (d) => d._id === searchId.trim() || d.name.toLowerCase().includes(searchId.toLowerCase())
    );
    if (doc) { 
      setViewDoctor(doc); 
      setNotFound(false); 
    } else { 
      setViewDoctor(null); 
      setNotFound(true); 
    }
  };

  const doctorRecords = viewDoctor
    ? medicalRecords.filter((r) => r.doctorId === viewDoctor._id)
    : [];

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

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Doctor Profiles</h1>
        <p className="text-gray-500 mt-1">Search and view doctor profiles and consultation history</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Search Doctor</h2>
        <div className="flex gap-3 mb-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              placeholder="Enter Doctor ID or Name..."
              value={searchId}
              onChange={(e) => { setSearchId(e.target.value); setNotFound(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9 pr-4 py-2.5 w-full border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button 
            onClick={handleSearch} 
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-medium cursor-pointer transition"
          >
            Search
          </button>
          {viewDoctor && (
            <button 
              onClick={() => { setViewDoctor(null); setSearchId(""); }} 
              className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <p className="text-xs text-gray-400 w-full">All doctors:</p>
          {doctors.map((d) => (
            <button 
              key={d._id} 
              onClick={() => setSearchId(d._id)} 
              className="text-xs bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-orange-700 px-2.5 py-1 rounded-lg border border-gray-100 cursor-pointer transition"
            >
              {d.name}
            </button>
          ))}
        </div>

        {notFound && (
          <div className="mt-3 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
            No doctor found: "{searchId}"
          </div>
        )}
      </div>

      {/* All Doctors Table */}
      {!viewDoctor && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">All Registered Doctors</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                  <th className="pb-3 pr-4">Doctor</th>
                  <th className="pb-3 pr-4">ID</th>
                  <th className="pb-3 pr-4">Clinic</th>
                  <th className="pb-3 pr-4">Specialties</th>
                  <th className="pb-3 pr-4">Fee</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {doctors.map((doc) => (
                  <tr key={doc._id} className="hover:bg-gray-50 transition">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={doc.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop"} 
                          alt={doc.name} 
                          className="w-10 h-10 rounded-xl object-cover" 
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-xs font-mono text-gray-500">{doc._id}</td>
                    <td className="py-4 pr-4 text-xs text-gray-600">{doc.clinicName}</td>
                    <td className="py-4 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {doc.specialties?.map((s) => (
                          <span key={s} className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-sm font-semibold text-teal-600">${doc.fee}</td>
                    <td className="py-4">
                      <button 
                        onClick={() => { setViewDoctor(doc); setSearchId(doc._id); }} 
                        className="flex items-center gap-1.5 text-xs text-orange-600 font-medium hover:underline cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Profile
                      </button>
                    </td>
                  </tr>
                ))}
                {doctors.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400 text-sm">
                      No doctors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Doctor Profile */}
      {viewDoctor && (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
            <div className="flex items-start gap-5">
              <img 
                src={viewDoctor.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop"} 
                alt={viewDoctor.name} 
                className="w-24 h-24 rounded-2xl object-cover flex-shrink-0 shadow" 
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{viewDoctor.name}</h2>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {viewDoctor.specialties?.map((s) => (
                        <span key={s} className="bg-purple-50 text-purple-600 text-xs font-medium px-2.5 py-1 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setViewDoctor(null)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer flex-shrink-0">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                  <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate">{viewDoctor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-700">{viewDoctor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-700">{viewDoctor.timing}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                    <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-700 font-semibold">${viewDoctor.fee}/visit</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 p-2.5 bg-blue-50 rounded-xl">
                  <Building2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="text-xs text-blue-700 font-medium">{viewDoctor.clinicName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Consultation History */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Consultation History</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 pr-4">Pet ID</th>
                    <th className="pb-3 pr-4">Pet Name</th>
                    <th className="pb-3 pr-4">Owner Contact</th>
                    <th className="pb-3 pr-4">Diagnosis</th>
                    <th className="pb-3">Prescription</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {doctorRecords.map((rec) => (
                    <tr key={rec._id} className="hover:bg-gray-50 transition">
                      <td className="py-3 pr-4 text-sm text-gray-600">{rec.date}</td>
                      <td className="py-3 pr-4 text-xs font-mono text-gray-500">{rec.petId}</td>
                      <td className="py-3 pr-4 text-sm font-medium text-gray-900">{rec.petName}</td>
                      <td className="py-3 pr-4 text-sm text-gray-600">{rec.ownerContact || 'N/A'}</td>
                      <td className="py-3 pr-4">
                        <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{rec.diagnosis}</span>
                      </td>
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
                  {doctorRecords.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-gray-400 text-sm">No consultation history</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}