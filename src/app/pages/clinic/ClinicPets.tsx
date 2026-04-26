import { useState, useEffect } from "react";
import { Search, FileText, Download, X, CheckCircle2, AlertCircle, Eye } from "lucide-react";

// Define types
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

type MedicalRecord = {
  _id: string;
  petId: string;
  petName: string;
  doctorId: string;
  doctorName: string;
  clinicId: string;
  clinicName?: string;
  date: string;
  diagnosis: string;
  prescription: string;
  notes?: string;
  type?: string;
  ownerContact?: string;
};

export default function ClinicPets() {
  const [searchId, setSearchId] = useState("");
  const [foundPet, setFoundPet] = useState<Pet | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [petRecords, setPetRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const API_URL = 'https://pet-care-server-one.vercel.app';

  // Fetch all pets from database
  useEffect(() => {
    fetchAllPets();
    fetchAllMedicalRecords();
  }, []);

  const fetchAllPets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/pets`);
      if (!response.ok) throw new Error('Failed to fetch pets');
      const data = await response.json();
      setPets(data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllMedicalRecords = async () => {
    try {
      const response = await fetch(`${API_URL}/medical-records`);
      if (!response.ok) throw new Error('Failed to fetch medical records');
      const data = await response.json();
      setMedicalRecords(data);
    } catch (error) {
      console.error('Error fetching medical records:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    
    setSearchLoading(true);
    try {
      // Search by ID or name from the fetched pets
      const pet = pets.find(
        (p: Pet) => p._id === searchId.trim() || p.name.toLowerCase().includes(searchId.toLowerCase())
      );
      
      if (pet) {
        setFoundPet(pet);
        setNotFound(false);
        
        // Fetch medical records for this pet
        const records = medicalRecords.filter((r: MedicalRecord) => r.petId === pet._id);
        setPetRecords(records);
      } else {
        setFoundPet(null);
        setNotFound(true);
        setPetRecords([]);
      }
    } catch (error) {
      console.error('Error searching pet:', error);
      setNotFound(true);
    } finally {
      setSearchLoading(false);
    }
  };

  // Function to download prescription
  const downloadPrescription = (record: MedicalRecord) => {
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
Clinic: ${record.clinicName || 'N/A'}

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
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Pets</h1>
        <p className="text-gray-500 mt-1">Search pets by ID and view their consultation history</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Search Pet</h2>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              placeholder="Enter Pet ID or Name..."
              value={searchId}
              onChange={(e) => { setSearchId(e.target.value); setNotFound(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9 pr-4 py-2.5 w-full border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searchLoading}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium cursor-pointer transition"
          >
            {searchLoading ? "Searching..." : "Search"}
          </button>
          {foundPet && (
            <button
              onClick={() => { setFoundPet(null); setSearchId(""); setPetRecords([]); }}
              className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>

        {/* Quick reference */}
        <div className="mt-3">
          <p className="text-xs text-gray-400 mb-2">All registered pets:</p>
          <div className="flex flex-wrap gap-2">
            {pets.map((p: Pet) => (
              <button
                key={p._id}
                onClick={() => { setSearchId(p._id); }}
                className="text-xs bg-gray-50 hover:bg-teal-50 text-gray-600 hover:text-teal-700 px-2.5 py-1 rounded-lg border border-gray-100 cursor-pointer transition"
              >
                {p.name}
              </button>
            ))}
            {pets.length === 0 && (
              <p className="text-xs text-gray-400">No pets found in database</p>
            )}
          </div>
        </div>

        {notFound && (
          <div className="mt-4 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
            No pet found with ID or name "{searchId}"
          </div>
        )}
      </div>

      {/* Pet Profile */}
      {foundPet && (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
            <h2 className="font-bold text-gray-900 mb-5">Pet Profile</h2>
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="w-36 h-36 rounded-2xl overflow-hidden flex-shrink-0">
                <img
                  src={foundPet.image || "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop"}
                  alt={foundPet.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "Pet ID", value: foundPet._id },
                  { label: "Name", value: foundPet.name },
                  { label: "Type", value: foundPet.type },
                  { label: "Breed", value: foundPet.breed },
                  { label: "Age", value: `${foundPet.age} years` },
                  { label: "Weight", value: foundPet.weight },
                  { label: "Color", value: foundPet.color },
                  { label: "Owner", value: foundPet.ownerName },
                  { label: "Owner Contact", value: foundPet.ownerContact },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">{value || "N/A"}</p>
                  </div>
                ))}
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500">Vaccination</p>
                  <div className={`flex items-center gap-1.5 mt-1 font-semibold text-sm ${foundPet.vaccinated ? "text-green-600" : "text-red-500"}`}>
                    {foundPet.vaccinated ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {foundPet.vaccinated ? "Vaccinated" : "Not Vaccinated"}
                  </div>
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
                    <th className="pb-3 pr-4">Doctor ID</th>
                    <th className="pb-3 pr-4">Doctor Name</th>
                    <th className="pb-3 pr-4">Diagnosis</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {petRecords.map((rec: MedicalRecord) => (
                    <tr key={rec._id} className="hover:bg-gray-50">
                      <td className="py-3 pr-4 text-sm text-gray-600">{rec.date}</td>
                      <td className="py-3 pr-4 text-xs font-mono text-gray-500">{rec.doctorId}</td>
                      <td className="py-3 pr-4 text-sm font-medium text-gray-900">{rec.doctorName}</td>
                      <td className="py-3 pr-4">
                        <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">{rec.diagnosis}</span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setSelectedRecord(rec)}
                            className="flex items-center gap-1.5 text-xs text-teal-600 font-medium hover:underline cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                          <button 
                            onClick={() => downloadPrescription(rec)}
                            className="flex items-center gap-1.5 text-xs text-blue-600 font-medium hover:underline cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" /> Download
                          </button>
                        </div>
                       </td>
                     </tr>
                  ))}
                  {petRecords.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-400 text-sm">
                        No consultation history for this pet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Medical Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="bg-teal-100 p-2.5 rounded-xl">
                  <FileText className="w-5 h-5 text-teal-600" />
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
                  <p className="text-xs text-gray-500 mb-1">Doctor Name</p>
                  <p className="font-semibold text-gray-900">{selectedRecord.doctorName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Doctor ID</p>
                  <p className="font-semibold text-gray-900 text-xs font-mono">{selectedRecord.doctorId}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Visit Type</p>
                  <p className="font-semibold text-gray-900">{selectedRecord.type || 'Consultation'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Clinic</p>
                  <p className="font-semibold text-gray-900">{selectedRecord.clinicName || 'N/A'}</p>
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

            <div className="flex gap-3 p-6 pt-0 sticky bottom-0 bg-white border-t border-gray-100">
              <button
                onClick={() => setSelectedRecord(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition"
              >
                Close
              </button>
              <button 
                onClick={() => downloadPrescription(selectedRecord)}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium cursor-pointer transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}