import { useState, useEffect } from "react";
import {
  APPOINTMENTS,
  DOCTORS,
  PETS,
  CLINICS,
  SYMPTOM_CONDITIONS,
} from "../../data/mockData";
import {
  Calendar,
  Video,
  Activity,
  X,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  ChevronDown,
  Loader2,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const APPT_TYPES = [
  "In-Person Visit",
  "Online Consultation",
  "AI Pet Symptom Assistant",
];

// Types
type Appointment = {
  _id?: string;
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
  status: string;
  createdAt?: string;
};

type Pet = {
  _id: string;
  name: string;
  breed: string;
  ownerId: string;
  age?: number;
  type?: string;
  [key: string]: any;
};

type Doctor = {
  _id: string;
  name: string;
  specialties: string[];
  clinicId: string;
  clinicName?: string;
  email?: string;
  phone?: string;
  image?: string;
  fee?: number;
  timing?: string;
  [key: string]: any;
};

type AIResult = {
  condition: string;
  severity: string;
  specialty: string;
  description: string;
  immediateCare: string;
  recommendation: string;
};

export default function OwnerAppointments() {
  const [activeTab, setActiveTab] = useState(0);
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookType, setBookType] = useState("In-Person Visit");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [recommendedDoctors, setRecommendedDoctors] = useState<Doctor[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInput, setUserInput] = useState("");
  const [petType, setPetType] = useState("");
  const [petAge, setPetAge] = useState("");

  // Data states
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [myPets, setMyPets] = useState<Pet[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [bookForm, setBookForm] = useState({
    petId: "",
    doctorId: "",
    date: "",
    time: "",
    reason: "",
  });

  const API_URL = "https://pet-care-server-one.vercel.app";

  // Fetch all data on component mount
  useEffect(() => {
    fetchAppointments();
    fetchPets();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${API_URL}/appointments`);
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const data = await response.json();
      const userAppointments = data.filter(
        (a: Appointment) => a.ownerId === "user_001",
      );
      setAppointments(userAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPets = async () => {
    try {
      const response = await fetch(`${API_URL}/pets`);
      if (!response.ok) throw new Error("Failed to fetch pets");
      const data = await response.json();
      const userPets = data.filter((p: Pet) => p.ownerId === "user_001");
      setMyPets(userPets);
      if (userPets.length > 0) {
        setBookForm((prev) => ({ ...prev, petId: userPets[0]._id }));
        setPetType(userPets[0].type || "");
        setPetAge(userPets[0].age?.toString() || "");
      }
    } catch (error) {
      console.error("Error fetching pets:", error);
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

  // const analyzeSymptomsWithAI = async () => {
  //   if (selectedSymptoms.length === 0 && !userInput.trim()) {
  //     alert("Please select symptoms or describe your pet's problem");
  //     return;
  //   }

  //   setIsAnalyzing(true);
  //   setAiResult(null);
  //   setRecommendedDoctors([]);

  //   try {
  //     const symptomsToAnalyze =
  //       selectedSymptoms.length > 0 ? selectedSymptoms : [userInput];

  //     const response = await fetch(`${API_URL}/api/ai-symptom-check`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         symptoms: symptomsToAnalyze,
  //         petType: petType,
  //         petAge: petAge,
  //       }),
  //     });

  //     if (!response.ok) throw new Error("Failed to analyze symptoms");

  //     const data = await response.json();
  //     setAiResult(data.aiResult);
  //     setRecommendedDoctors(data.recommendedDoctors);
  //   } catch (error) {
  //     console.error("Error analyzing symptoms:", error);
  //     alert("Failed to analyze symptoms. Please try again.");
  //   } finally {
  //     setIsAnalyzing(false);
  //   }
  // };

  const analyzeSymptomsWithAI = async () => {
    if (!bookForm.petId) {
      alert("Please select a pet first");
      return;
    }

    if (!userInput.trim()) {
      alert("Please describe your pet's problem");
      return;
    }

    setIsAnalyzing(true);
    setAiResult(null);
    setRecommendedDoctors([]);

    try {
      // Get complete pet information
      const selectedPet = myPets.find((p) => p._id === bookForm.petId);

      if (!selectedPet) {
        alert("Pet not found");
        return;
      }

      const symptomsToAnalyze = [userInput];

      const response = await fetch(`${API_URL}/api/ai-symptom-check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms: symptomsToAnalyze,
          petType: selectedPet.type || "",
          petAge: selectedPet.age || "",
          petName: selectedPet.name,
          petBreed: selectedPet.breed,
          petWeight: selectedPet.weight || "",
        }),
      });

      if (!response.ok) throw new Error("Failed to analyze symptoms");

      const data = await response.json();
      setAiResult(data.aiResult);
      setRecommendedDoctors(data.recommendedDoctors);
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      alert("Failed to analyze symptoms. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym],
    );
    setAiResult(null);
    setRecommendedDoctors([]);
  };

  const handleBookAppointment = async () => {
    if (!bookForm.petId) {
      alert("Please select a pet");
      return;
    }
    if (!bookForm.doctorId) {
      alert("Please select a doctor");
      return;
    }
    if (!bookForm.date) {
      alert("Please select a date");
      return;
    }
    if (!bookForm.time) {
      alert("Please select a time");
      return;
    }

    setIsSaving(true);

    const selectedPet = myPets.find((p) => p._id === bookForm.petId);
    const selectedDoctor = doctors.find((d) => d._id === bookForm.doctorId);
    const selectedClinic = CLINICS.find(
      (c) => c._id === selectedDoctor?.clinicId,
    );

    const appointmentData: Appointment = {
      type: bookType,
      petId: bookForm.petId,
      petName: selectedPet?.name || "",
      doctorId: bookForm.doctorId,
      doctorName: selectedDoctor?.name || "",
      clinicId: selectedDoctor?.clinicId || "",
      clinicName: selectedClinic?.name || "PawsCity Veterinary Clinic",
      date: bookForm.date,
      time: bookForm.time,
      reason: bookForm.reason,
      ownerId: "user_001",
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) throw new Error("Failed to book appointment");

      await fetchAppointments();
      setShowBookModal(false);
      alert("Appointment booked successfully! Status: Pending");

      setBookForm({
        petId: myPets[0]?._id || "",
        doctorId: "",
        date: "",
        time: "",
        reason: "",
      });
      setBookType("In-Person Visit");
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const upcoming = appointments.filter(
    (a) => a.status === "Accepted" || a.status === "Pending",
  );
  const previous = appointments.filter((a) => a.status === "Visited");

  const typeIcon = (type: string) => {
    if (type === "Online Consultation")
      return <Video className="w-4 h-4 text-blue-500" />;
    if (type === "AI Pet Symptom Assistant")
      return <Activity className="w-4 h-4 text-purple-500" />;
    return <Calendar className="w-4 h-4 text-emerald-500" />;
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500 mt-1">
            Manage and track your pet appointments
          </p>
        </div>
        <button
          onClick={() => setShowBookModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition cursor-pointer flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" /> Book Appointment
        </button>
      </div>

      {/* Appointment Type Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {APPT_TYPES.map((type, i) => (
          <button
            key={type}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 cursor-pointer ${
              activeTab === i
                ? "bg-teal-600 text-white shadow"
                : "bg-white text-gray-600 border border-gray-200 hover:border-teal-300"
            }`}
          >
            {typeIcon(type)} {type}
          </button>
        ))}
      </div>

      {/* AI Pet Symptom Assistant */}
      {activeTab === 2 && (
        <div className="space-y-6">
          {/* Symptom Input Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-2.5 rounded-xl">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">
                  AI Pet Symptom Assistant
                </h2>
                <p className="text-sm text-gray-500">
                  Describe your pet's problem or select symptoms
                </p>
              </div>
            </div>

            {/* Pet Info */}
            {/* <div className="gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Select Your Pet
                </label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={bookForm.petId}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, petId: e.target.value })
                  }
                >
                  <option value="">Select a pet</option>
                  {myPets.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div> */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Select Your Pet
              </label>
              <select
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={bookForm.petId}
                onChange={(e) =>
                  setBookForm({ ...bookForm, petId: e.target.value })
                }
              >
                <option value="">Select a pet</option>
                {myPets.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} - {p.breed} ({p.age} years)
                  </option>
                ))}
              </select>
            </div>
            {/* Selected Pet Information Display */}
            {bookForm.petId && (
              <div className="my-4 p-4 bg-blue-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Selected Pet Information
                </h3>
                {(() => {
                  const selectedPet = myPets.find(
                    (p) => p._id === bookForm.petId,
                  );
                  if (!selectedPet) return null;
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Name</p>
                        <p className="font-medium text-gray-900">
                          {selectedPet.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Type</p>
                        <p className="font-medium text-gray-900">
                          {selectedPet.type || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Age</p>
                        <p className="font-medium text-gray-900">
                          {selectedPet.age || "N/A"} years
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Breed</p>
                        <p className="font-medium text-gray-900">
                          {selectedPet.breed || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Weight</p>
                        <p className="font-medium text-gray-900">
                          {selectedPet.weight || "N/A"}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
            {/* Text Input for Custom Symptoms */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Describe your pet's problem
              </label>
              <textarea
                rows={3}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="e.g., My dog has been coughing and seems tired for the past 2 days..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            <button
              onClick={analyzeSymptomsWithAI}
              disabled={
                isAnalyzing ||
                (selectedSymptoms.length === 0 && !userInput.trim())
              }
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-medium text-sm cursor-pointer transition flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" /> Analyze Symptoms with AI
                </>
              )}
            </button>
          </div>

          {/* AI Diagnosis Result */}
          {aiResult && (
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-purple-900 text-lg">
                  AI Diagnosis Result
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-xl p-4">
                  <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">
                    Possible Condition
                  </p>
                  <p className="text-gray-900 font-semibold mt-1">
                    {aiResult.condition}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">
                    Severity
                  </p>
                  <p
                    className={`font-semibold mt-1 ${
                      aiResult.severity === "Mild"
                        ? "text-green-600"
                        : aiResult.severity === "Moderate"
                          ? "text-yellow-600"
                          : aiResult.severity === "Severe"
                            ? "text-orange-600"
                            : "text-red-600"
                    }`}
                  >
                    {aiResult.severity}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">
                    Recommended Specialty
                  </p>
                  <p className="text-gray-900 font-semibold mt-1">
                    {aiResult.specialty}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">
                    Recommendation
                  </p>
                  <p
                    className={`font-semibold mt-1 ${
                      aiResult.recommendation === "Emergency"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {aiResult.recommendation}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 mb-4">
                <p className="text-xs text-purple-600 font-medium uppercase tracking-wide mb-1">
                  Description
                </p>
                <p className="text-gray-700">{aiResult.description}</p>
              </div>

              <div className="bg-white rounded-xl p-4">
                <p className="text-xs text-purple-600 font-medium uppercase tracking-wide mb-1">
                  Immediate Care
                </p>
                <p className="text-gray-700">{aiResult.immediateCare}</p>
              </div>
            </div>
          )}

          {/* Recommended Doctors */}
          {recommendedDoctors.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4">
                Recommended Doctors for {aiResult?.specialty}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedDoctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={
                          doctor.image ||
                          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop"
                        }
                        alt={doctor.name}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {doctor.name}
                        </h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {doctor.specialties?.slice(0, 2).map((s) => (
                            <span
                              key={s}
                              className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <span>💰 ${doctor.fee}/visit</span>
                          <span>•</span>
                          <span>⏰ {doctor.timing?.split(",")[0]}</span>
                        </div>
                        <button
                          onClick={() => {
                            setBookForm({ ...bookForm, doctorId: doctor._id });
                            setShowBookModal(true);
                          }}
                          className="mt-3 text-sm text-purple-600 font-medium hover:underline"
                        >
                          Book Appointment →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
            <p className="text-xs text-yellow-700">
              ⚠️ This is an AI-powered assistant for informational purposes
              only. Always consult a licensed veterinarian for proper diagnosis
              and treatment.
            </p>
          </div>
        </div>
      )}

      {/* Tables for Appointments - Keep your existing code */}
      {/* {activeTab !== 2 && ( */}
      {activeTab !== 2 && (
        <>
          {/* Upcoming */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-gray-900 mb-4">
              Upcoming Appointments
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    <th className="pb-3 pr-4">Pet</th>
                    <th className="pb-3 pr-4">Doctor</th>
                    <th className="pb-3 pr-4">Clinic</th>
                    <th className="pb-3 pr-4">Date & Time</th>
                    <th className="pb-3 pr-4">Type</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {upcoming
                    .filter((a) =>
                      activeTab === 0
                        ? a.type === "In-Person Visit"
                        : a.type === "Online Consultation",
                    )
                    .map((appt) => (
                      <tr
                        key={appt._id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="py-3 pr-4 text-sm font-medium text-gray-900">
                          {appt.petName}
                        </td>
                        <td className="py-3 pr-4 text-sm text-gray-600">
                          {appt.doctorName}
                        </td>
                        <td className="py-3 pr-4 text-sm text-gray-600">
                          {appt.clinicName}
                        </td>
                        <td className="py-3 pr-4 text-sm text-gray-600">
                          {appt.date} {appt.time}
                        </td>
                        <td className="py-3 pr-4">
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                            {appt.type}
                          </span>
                        </td>
                        <td className="py-3">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              appt.status === "Accepted"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {appt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  {upcoming.filter((a) =>
                    activeTab === 0
                      ? a.type === "In-Person Visit"
                      : a.type === "Online Consultation",
                  ).length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-8 text-gray-400 text-sm"
                      >
                        No upcoming appointments
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Previous */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">
              Previous Appointments
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    <th className="pb-3 pr-4">Pet</th>
                    <th className="pb-3 pr-4">Doctor</th>
                    <th className="pb-3 pr-4">Clinic</th>
                    <th className="pb-3 pr-4">Date & Time</th>
                    <th className="pb-3 pr-4">Type</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {previous.map((appt) => (
                    <tr key={appt._id} className="hover:bg-gray-50 transition">
                      <td className="py-3 pr-4 text-sm font-medium text-gray-900">
                        {appt.petName}
                      </td>
                      <td className="py-3 pr-4 text-sm text-gray-600">
                        {appt.doctorName}
                      </td>
                      <td className="py-3 pr-4 text-sm text-gray-600">
                        {appt.clinicName}
                      </td>
                      <td className="py-3 pr-4 text-sm text-gray-600">
                        {appt.date} {appt.time}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                          {appt.type}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                          Visited
                        </span>
                      </td>
                    </tr>
                  ))}
                  {previous.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-8 text-gray-400 text-sm"
                      >
                        No previous appointments
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Book Appointment Modal - Keep your existing modal code */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg">
                Book Appointment
              </h2>
              <button
                onClick={() => setShowBookModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Appointment Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["In-Person Visit", "Online Consultation"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setBookType(t)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium border transition cursor-pointer ${
                        bookType === t
                          ? "bg-teal-600 text-white border-teal-600"
                          : "border-gray-200 text-gray-600 hover:border-teal-300"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Select Pet
                </label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={bookForm.petId}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, petId: e.target.value })
                  }
                >
                  <option value="">Select a pet</option>
                  {myPets.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.breed})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Select Doctor
                </label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={bookForm.doctorId}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, doctorId: e.target.value })
                  }
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name} – {d.specialties?.join(", ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={bookForm.date}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={bookForm.time}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, time: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Reason for Visit
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe symptoms or reason..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  value={bookForm.reason}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, reason: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => setShowBookModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBookAppointment}
                disabled={isSaving}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Booking..." : "Book Appointment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
