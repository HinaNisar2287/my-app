
// @ts-nocheck
"use client";

import { useState } from "react";
import {
  LayoutDashboard, Users, Stethoscope, CalendarDays,
  Building2, FlaskConical, Pill, CreditCard, BarChart3,
  Settings, Bell, Search, Menu, X, Plus, ArrowUpRight,
  Clock, CheckCircle2, Activity, HeartPulse, Pencil,
  Trash2, Eye
} from "lucide-react";

import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

// ================= TYPES =================

type Patient = {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  condition: string;
};

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  department: string;
  phone: string;
  email: string;
  experience: string;
};

type Department = {
  id: number;
  name: string;
  description: string;
  doctors: number;
  status: "Active" | "Inactive";
  icon: string;
};

type Appointment = {
  id: number;
  patientId: number;
  patient: string;
  doctorId: number;
  doctor: string;
  department: string;
  date: string;
  time: string;
  status: "Pending" | "Confirmed" | "Cancelled";
};

// ================= NAVIGATION =================

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Patients", icon: Users },
  { name: "Doctors", icon: Stethoscope },
  { name: "Appointments", icon: CalendarDays },
  { name: "Departments", icon: Building2 },
  { name: "Laboratory", icon: FlaskConical },
  { name: "Pharmacy", icon: Pill },
  { name: "Billing", icon: CreditCard },
  { name: "Reports", icon: BarChart3 },
  { name: "Settings", icon: Settings },
];

// ================= SAMPLE DATA =================

const initialPatients: Patient[] = [
  { id: 1, name: "Ali Ahmed", age: 28, gender: "Male", phone: "03001234567", condition: "Fever" },
  { id: 2, name: "Ayesha Noor", age: 32, gender: "Female", phone: "03011234567", condition: "General Checkup" },
  { id: 3, name: "Hamza Malik", age: 45, gender: "Male", phone: "03021234567", condition: "Cardiology" },
];

const initialDoctors: Doctor[] = [
  { id: 1, name: "Dr. Sarah Khan", specialty: "Cardiologist", department: "Cardiology", phone: "03001234567", email: "sarah@example.com", experience: "10 Years" },
  { id: 2, name: "Dr. Usman Ali", specialty: "Neurologist", department: "Neurology", phone: "03011234567", email: "usman@example.com", experience: "8 Years" },
  { id: 3, name: "Dr. Fatima Noor", specialty: "Pediatrician", department: "Pediatrics", phone: "03021234567", email: "fatima@example.com", experience: "6 Years" },
];

const initialAppointments: Appointment[] = [
  {
    id: 1, patientId: 1, patient: "Ali Ahmed",
    doctorId: 1, doctor: "Dr. Sarah Khan",
    department: "Cardiology", date: "2026-11-23",
    time: "09:00", status: "Confirmed"
  },
  {
    id: 2, patientId: 2, patient: "Ayesha Noor",
    doctorId: 2, doctor: "Dr. Usman Ali",
    department: "Neurology", date: "2026-11-24",
    time: "10:30", status: "Pending"
  },
  {
    id: 3, patientId: 3, patient: "Hamza Malik",
    doctorId: 3, doctor: "Dr. Fatima Noor",
    department: "Pediatrics", date: "2026-11-25",
    time: "11:00", status: "Confirmed"
  },
];

const initialDepartments: Department[] = [
  { id: 1, name: "Cardiology", description: "Heart and cardiovascular care", doctors: 12, status: "Active", icon: "❤️" },
  { id: 2, name: "Neurology", description: "Brain and nervous system care", doctors: 8, status: "Active", icon: "🧠" },
  { id: 3, name: "Orthopedics", description: "Bone and joint treatment", doctors: 10, status: "Active", icon: "🦴" },
  { id: 4, name: "Pediatrics", description: "Healthcare for children", doctors: 9, status: "Active", icon: "👶" },
  { id: 5, name: "General Medicine", description: "General medical consultation", doctors: 9, status: "Active", icon: "🩺" },
];

const chartData = [
  { month: "Jan", patients: 320 },
  { month: "Feb", patients: 450 },
  { month: "Mar", patients: 390 },
  { month: "Apr", patients: 580 },
  { month: "May", patients: 490 },
  { month: "Jun", patients: 700 },
  { month: "Jul", patients: 650 },
  { month: "Aug", patients: 850 },
  { month: "Sep", patients: 760 },
  { month: "Oct", patients: 950 },
  { month: "Nov", patients: 890 },
  { month: "Dec", patients: 1100 },
];

// ================= MAIN COMPONENT =================

export default function Home() {
  const [active, setActive] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [viewRecord, setViewRecord] = useState<Patient | Doctor | null>(null);
  const [viewAppointment, setViewAppointment] = useState<Appointment | null>(null);
  const [viewDepartment, setViewDepartment] = useState<Department | null>(null);

  const [patientForm, setPatientForm] = useState({
    name: "", age: "", gender: "Male", phone: "", condition: ""
  });

  const [doctorForm, setDoctorForm] = useState({
    name: "", specialty: "", department: "General Medicine",
    phone: "", email: "", experience: ""
  });

  const [appointmentForm, setAppointmentForm] = useState({
    patientId: "", doctorId: "", date: "", time: "",
    status: "Pending" as Appointment["status"]
  });

  const [departmentForm, setDepartmentForm] = useState({
    name: "", description: "", doctors: "0",
    status: "Active" as Department["status"], icon: "🏥"
  });

  // ================= FILTERS AND STATISTICS =================

  const stats = [
    { title: "Total Patients", value: patients.length.toString(), change: "+12%", icon: Users, color: "blue" },
    { title: "Total Doctors", value: doctors.length.toString(), change: "+5%", icon: Stethoscope, color: "green" },
    { title: "Appointments", value: appointments.length.toString(), change: "+18%", icon: CalendarDays, color: "purple" },
    { title: "Departments", value: departments.length.toString(), change: "+2%", icon: Building2, color: "orange" },
  ];

  const filteredPatients = patients.filter(p =>
    `${p.name} ${p.phone} ${p.condition}`.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDoctors = doctors.filter(d =>
    `${d.name} ${d.specialty} ${d.department}`.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAppointments = appointments.filter(a =>
    `${a.patient} ${a.doctor} ${a.department} ${a.date} ${a.status}`
      .toLowerCase().includes(search.toLowerCase())
  );

  const filteredDepartments = departments.filter(d =>
    `${d.name} ${d.description} ${d.status}`
      .toLowerCase().includes(search.toLowerCase())
  );

  // ================= PATIENT FUNCTIONS =================

  function openPatientForm(patient?: Patient) {
    if (patient) {
      setEditingId(patient.id);
      setPatientForm({
        name: patient.name,
        age: String(patient.age),
        gender: patient.gender,
        phone: patient.phone,
        condition: patient.condition
      });
    } else {
      setEditingId(null);
      setPatientForm({
        name: "", age: "", gender: "Male", phone: "", condition: ""
      });
    }
    setShowForm(true);
  }

  function savePatient(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const record: Patient = {
      id: editingId ?? Date.now(),
      name: patientForm.name.trim(),
      age: Number(patientForm.age),
      gender: patientForm.gender,
      phone: patientForm.phone.trim(),
      condition: patientForm.condition.trim()
    };

    if (editingId !== null) {
      setPatients(prev => prev.map(p => p.id === editingId ? record : p));
    } else {
      setPatients(prev => [...prev, record]);
    }

    setShowForm(false);
    setEditingId(null);
  }

  function deletePatient(id: number) {
    if (window.confirm("Delete this patient record?")) {
      setPatients(prev => prev.filter(p => p.id !== id));
    }
  }

  // ================= DOCTOR FUNCTIONS =================

  function openDoctorForm(doctor?: Doctor) {
    if (doctor) {
      setEditingId(doctor.id);
      setDoctorForm({
        name: doctor.name,
        specialty: doctor.specialty,
        department: doctor.department,
        phone: doctor.phone,
        email: doctor.email,
        experience: doctor.experience
      });
    } else {
      setEditingId(null);
      setDoctorForm({
        name: "", specialty: "", department: "General Medicine",
        phone: "", email: "", experience: ""
      });
    }
    setShowForm(true);
  }

  function saveDoctor(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const record: Doctor = {
      id: editingId ?? Date.now(),
      ...doctorForm,
      name: doctorForm.name.trim()
    };

    if (editingId !== null) {
      setDoctors(prev => prev.map(d => d.id === editingId ? record : d));
    } else {
      setDoctors(prev => [...prev, record]);
    }

    setShowForm(false);
    setEditingId(null);
  }

  function deleteDoctor(id: number) {
    if (window.confirm("Delete this doctor record?")) {
      setDoctors(prev => prev.filter(d => d.id !== id));
    }
  }

  // ================= APPOINTMENT FUNCTIONS =================

  function openAppointmentForm(appointment?: Appointment) {
    if (appointment) {
      setEditingId(appointment.id);
      setAppointmentForm({
        patientId: String(appointment.patientId),
        doctorId: String(appointment.doctorId),
        date: appointment.date,
        time: appointment.time,
        status: appointment.status
      });
    } else {
      setEditingId(null);
      setAppointmentForm({
        patientId: patients[0] ? String(patients[0].id) : "",
        doctorId: doctors[0] ? String(doctors[0].id) : "",
        date: "",
        time: "",
        status: "Pending"
      });
    }
    setShowForm(true);
  }

  function saveAppointment(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const selectedPatient = patients.find(
      p => p.id === Number(appointmentForm.patientId)
    );

    const selectedDoctor = doctors.find(
      d => d.id === Number(appointmentForm.doctorId)
    );

    if (!selectedPatient || !selectedDoctor) {
      window.alert("Please select a valid patient and doctor.");
      return;
    }

    const record: Appointment = {
      id: editingId ?? Date.now(),
      patientId: selectedPatient.id,
      patient: selectedPatient.name,
      doctorId: selectedDoctor.id,
      doctor: selectedDoctor.name,
      department: selectedDoctor.department,
      date: appointmentForm.date,
      time: appointmentForm.time,
      status: appointmentForm.status
    };

    if (editingId !== null) {
      setAppointments(prev => prev.map(a => a.id === editingId ? record : a));
    } else {
      setAppointments(prev => [...prev, record]);
    }

    setShowForm(false);
    setEditingId(null);
  }

  function deleteAppointment(id: number) {
    if (window.confirm("Delete this appointment?")) {
      setAppointments(prev => prev.filter(a => a.id !== id));
    }
  }

  // ================= DEPARTMENT FUNCTIONS =================

  function openDepartmentForm(department?: Department) {
    if (department) {
      setEditingId(department.id);
      setDepartmentForm({
        name: department.name,
        description: department.description,
        doctors: String(department.doctors),
        status: department.status,
        icon: department.icon
      });
    } else {
      setEditingId(null);
      setDepartmentForm({
        name: "", description: "", doctors: "0",
        status: "Active", icon: "🏥"
      });
    }
    setShowForm(true);
  }

  function saveDepartment(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const record: Department = {
      id: editingId ?? Date.now(),
      name: departmentForm.name.trim(),
      description: departmentForm.description.trim(),
      doctors: Number(departmentForm.doctors),
      status: departmentForm.status,
      icon: departmentForm.icon
    };

    if (editingId !== null) {
      setDepartments(prev =>
        prev.map(d => d.id === editingId ? record : d)
      );
    } else {
      setDepartments(prev => [...prev, record]);
    }

    setShowForm(false);
    setEditingId(null);
  }

  function deleteDepartment(id: number) {
    if (window.confirm("Delete this department?")) {
      setDepartments(prev => prev.filter(d => d.id !== id));
    }
  }

  // ================= NAVIGATION FUNCTION =================

  function changeModule(name: string) {
    setActive(name);
    setSearch("");
    setMobileOpen(false);
    setShowForm(false);
    setViewRecord(null);
    setViewAppointment(null);
    setViewDepartment(null);
  }

  // ================= USER INTERFACE =================

  return (
    <div className="app-shell">

      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* SIDEBAR */}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><HeartPulse size={25} /></div>
          <div>
            <h2>MediCare<span>+</span></h2>
            <small>HOSPITAL MANAGEMENT</small>
          </div>
          <button className="close-sidebar" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <p className="menu-label">MAIN MENU</p>

        <nav>
          {navigation.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => {
                  if (item.name === "Billing") {
                    window.location.href = "/billing";
                    return;
                  }

                  if (item.name === "Laboratory") {
                    window.location.href = "/laboratory";
                    return;
                  }

                  if (item.name === "Pharmacy") {
                    window.location.href = "/pharmacy";
                    return;
                  }

                  changeModule(item.name);
                }}
                className={`nav-item ${active === item.name ? "active" : ""}`}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="support-card">
            <Activity size={22} />
            <strong>Need assistance?</strong>
            <p>Contact hospital administration.</p>
          </div>

          <div className="profile">
            <div className="avatar">MA</div>
            <div>
              <strong>MediCare Admin</strong>
              <small>Administrator</small>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}

      <main className="main-area">

        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)}>
            <Menu size={23} />
          </button>

          <div className="breadcrumb">
            <span>Hospital</span>
            <span>/</span>
            <strong>{active}</strong>
          </div>

          <div className="top-actions">
            <div className="search-box">
              <Search size={17} />
              <input
                placeholder={`Search ${active.toLowerCase()}...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <button className="notification">
              <Bell size={20} />
              <i />
            </button>

            <div className="top-avatar">MA</div>
          </div>
        </header>

        <div className="dashboard-content">

          {/* PAGE HEADER */}

          <div className="welcome-row">
            <div>
              <p className="eyebrow">HOSPITAL MANAGEMENT</p>
              <h1>
                {active === "Dashboard"
                  ? "Hospital Dashboard"
                  : `${active} Management`}
              </h1>
              <p className="subtitle">
                Manage your hospital information in one place.
              </p>
            </div>

            {["Patients", "Doctors", "Appointments", "Departments"].includes(active) && (
              <button
                className="primary-button"
                onClick={() => {
                  if (active === "Patients") openPatientForm();
                  if (active === "Doctors") openDoctorForm();
                  if (active === "Appointments") openAppointmentForm();
                  if (active === "Departments") openDepartmentForm();
                }}
              >
                <Plus size={18} />
                Add {active === "Patients" ? "Patient" :
                  active === "Doctors" ? "Doctor" :
                  active === "Appointments" ? "Appointment" : "Department"}
              </button>
            )}
          </div>

          {/* DASHBOARD */}

          {active === "Dashboard" && (
            <>
              <section className="stats-grid">
                {stats.map(stat => {
                  const Icon = stat.icon;
                  return (
                    <div className="stat-card" key={stat.title}>
                      <div className="stat-top">
                        <div className={`stat-icon ${stat.color}`}>
                          <Icon size={22} />
                        </div>
                        <span className="growth">
                          <ArrowUpRight size={15} />
                          {stat.change}
                        </span>
                      </div>
                      <p>{stat.title}</p>
                      <h2>{stat.value}</h2>
                    </div>
                  );
                })}
              </section>

              <section className="middle-grid">
                <div className="panel chart-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Patient Overview</h3>
                      <p>Monthly patient statistics</p>
                    </div>
                    <span className="chart-tag">2026</span>
                  </div>

                  <div className="chart-area">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="patientGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3478F6" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#3478F6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#edf0f5" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="patients"
                          stroke="#3478F6"
                          strokeWidth={3}
                          fill="url(#patientGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="panel activity-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Hospital Activity</h3>
                      <p>Today's overview</p>
                    </div>
                    <Activity color="#3478F6" />
                  </div>

                  <div className="activity-item">
                    <div className="activity-icon blue"><Users size={19} /></div>
                    <div>
                      <strong>{patients.length}</strong>
                      <p>Patient records</p>
                    </div>
                  </div>

                  <div className="activity-item">
                    <div className="activity-icon green"><CheckCircle2 size={19} /></div>
                    <div>
                      <strong>{doctors.length}</strong>
                      <p>Doctor records</p>
                    </div>
                  </div>

                  <div className="activity-item">
                    <div className="activity-icon purple"><Clock size={19} /></div>
                    <div>
                      <strong>{appointments.length}</strong>
                      <p>Appointments</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="panel appointments-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Recent Appointments</h3>
                    <p>Demonstration records</p>
                  </div>
                  <button className="text-button" onClick={() => changeModule("Appointments")}>
                    View all <ArrowUpRight size={15} />
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Department</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.slice(0, 4).map(item => (
                        <tr key={item.id}>
                          <td><strong>{item.patient}</strong></td>
                          <td>{item.doctor}</td>
                          <td>{item.department}</td>
                          <td>{item.date}</td>
                          <td>{item.time}</td>
                          <td>
                            <span className={`status ${item.status.toLowerCase()}`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="departments-section">
                <div className="section-heading">
                  <div>
                    <h3>Hospital Departments</h3>
                    <p>Medical specialties</p>
                  </div>
                  <button className="text-button" onClick={() => changeModule("Departments")}>
                    View all <ArrowUpRight size={15} />
                  </button>
                </div>

                <div className="department-grid">
                  {departments.slice(0, 5).map(department => (
                    <div className="department-card" key={department.id}>
                      <div className="department-emoji">{department.icon}</div>
                      <strong>{department.name}</strong>
                      <p>{department.doctors} Doctors</p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* PATIENT MANAGEMENT */}

          {active === "Patients" && (
            <section className="panel appointments-panel">
              <div className="panel-heading">
                <div>
                  <h3>Patient Records</h3>
                  <p>{patients.length} registered patients · Demo data</p>
                </div>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Phone</th>
                      <th>Condition</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map(patient => (
                      <tr key={patient.id}>
                        <td><strong>{patient.name}</strong></td>
                        <td>{patient.age}</td>
                        <td>{patient.gender}</td>
                        <td>{patient.phone}</td>
                        <td>{patient.condition}</td>
                        <td>
                          <div className="doctor-actions">
                            <button className="action-button view" title="View" onClick={() => setViewRecord(patient)}>
                              <Eye size={16} />
                            </button>
                            <button className="action-button edit" title="Edit" onClick={() => openPatientForm(patient)}>
                              <Pencil size={16} />
                            </button>
                            <button className="action-button delete" title="Delete" onClick={() => deletePatient(patient.id)}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredPatients.length === 0 && (
                  <p className="empty-state">No patients found.</p>
                )}
              </div>
            </section>
          )}

          {/* DOCTOR MANAGEMENT */}

          {active === "Doctors" && (
            <section className="panel appointments-panel">
              <div className="panel-heading">
                <div>
                  <h3>Doctor Directory</h3>
                  <p>{doctors.length} registered doctors · Demo data</p>
                </div>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Doctor</th>
                      <th>Specialty</th>
                      <th>Department</th>
                      <th>Phone</th>
                      <th>Experience</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDoctors.map(doctor => (
                      <tr key={doctor.id}>
                        <td><strong>{doctor.name}</strong></td>
                        <td>{doctor.specialty}</td>
                        <td>{doctor.department}</td>
                        <td>{doctor.phone}</td>
                        <td>{doctor.experience}</td>
                        <td>
                          <div className="doctor-actions">
                            <button className="action-button view" title="View" onClick={() => setViewRecord(doctor)}>
                              <Eye size={16} />
                            </button>
                            <button className="action-button edit" title="Edit" onClick={() => openDoctorForm(doctor)}>
                              <Pencil size={16} />
                            </button>
                            <button className="action-button delete" title="Delete" onClick={() => deleteDoctor(doctor.id)}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredDoctors.length === 0 && (
                  <p className="empty-state">No doctors found.</p>
                )}
              </div>
            </section>
          )}

          {/* APPOINTMENT MANAGEMENT */}

          {active === "Appointments" && (
            <section className="panel appointments-panel">
              <div className="panel-heading">
                <div>
                  <h3>Appointment Records</h3>
                  <p>{appointments.length} appointments · Demo data</p>
                </div>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Department</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map(item => (
                      <tr key={item.id}>
                        <td><strong>{item.patient}</strong></td>
                        <td>{item.doctor}</td>
                        <td>{item.department}</td>
                        <td>{item.date}</td>
                        <td>{item.time}</td>
                        <td>
                          <span className={`status ${item.status.toLowerCase()}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <div className="doctor-actions">
                            <button className="action-button view" title="View" onClick={() => setViewAppointment(item)}>
                              <Eye size={16} />
                            </button>
                            <button className="action-button edit" title="Edit" onClick={() => openAppointmentForm(item)}>
                              <Pencil size={16} />
                            </button>
                            <button className="action-button delete" title="Delete" onClick={() => deleteAppointment(item.id)}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredAppointments.length === 0 && (
                  <p className="empty-state">No appointments found.</p>
                )}
              </div>
            </section>
          )}

          {/* DEPARTMENT MANAGEMENT */}

          {active === "Departments" && (
            <section className="panel appointments-panel">
              <div className="panel-heading">
                <div>
                  <h3>Department Directory</h3>
                  <p>{departments.length} departments · Demonstration records</p>
                </div>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Description</th>
                      <th>Doctors</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDepartments.map(department => (
                      <tr key={department.id}>
                        <td><strong>{department.icon} {department.name}</strong></td>
                        <td>{department.description}</td>
                        <td>{department.doctors}</td>
                        <td>
                          <span className={`status ${department.status.toLowerCase()}`}>
                            {department.status}
                          </span>
                        </td>
                        <td>
                          <div className="doctor-actions">
                            <button className="action-button view" title="View" onClick={() => setViewDepartment(department)}>
                              <Eye size={16} />
                            </button>
                            <button className="action-button edit" title="Edit" onClick={() => openDepartmentForm(department)}>
                              <Pencil size={16} />
                            </button>
                            <button className="action-button delete" title="Delete" onClick={() => deleteDepartment(department.id)}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredDepartments.length === 0 && (
                  <p className="empty-state">No departments found.</p>
                )}
              </div>
            </section>
          )}

          {/* OTHER MODULES */}

          {!["Dashboard", "Patients", "Doctors", "Appointments", "Departments"].includes(active) && (
            <section className="panel module-panel">
              <div className="module-icon"><Activity size={30} /></div>
              <h2>{active} Management</h2>
              
              <button className="primary-button" onClick={() => changeModule("Dashboard")}>
                Return to Dashboard
              </button>
            </section>
          )}

        </div>

        <footer>
          © 2026 MediCare+ Hospital Management System. All rights reserved.
        </footer>
      </main>

      {/* ADD / EDIT FORMS */}

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <form
            className="modal"
            onSubmit={
              active === "Patients" ? savePatient :
              active === "Doctors" ? saveDoctor :
              active === "Appointments" ? saveAppointment :
              saveDepartment
            }
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-heading">
              <h2>
                {editingId !== null ? "Edit" : "Add"}{" "}
                {active === "Patients" ? "Patient" :
                 active === "Doctors" ? "Doctor" :
                 active === "Appointments" ? "Appointment" : "Department"}
              </h2>
              <button type="button" onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>

            {/* PATIENT FORM */}

            {active === "Patients" && (
              <>
                <label>Patient Name</label>
                <input required value={patientForm.name}
                  onChange={e => setPatientForm({ ...patientForm, name: e.target.value })}
                  placeholder="Enter patient name" />

                <label>Age</label>
                <input required type="number" min="0" value={patientForm.age}
                  onChange={e => setPatientForm({ ...patientForm, age: e.target.value })}
                  placeholder="Enter age" />

                <label>Gender</label>
                <select value={patientForm.gender}
                  onChange={e => setPatientForm({ ...patientForm, gender: e.target.value })}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>

                <label>Phone</label>
                <input required value={patientForm.phone}
                  onChange={e => setPatientForm({ ...patientForm, phone: e.target.value })}
                  placeholder="Enter phone number" />

                <label>Condition / Visit Reason</label>
                <input required value={patientForm.condition}
                  onChange={e => setPatientForm({ ...patientForm, condition: e.target.value })}
                  placeholder="Enter visit reason" />
              </>
            )}

            {/* DOCTOR FORM */}

            {active === "Doctors" && (
              <>
                <label>Doctor Name</label>
                <input required value={doctorForm.name}
                  onChange={e => setDoctorForm({ ...doctorForm, name: e.target.value })}
                  placeholder="Enter doctor name" />

                <label>Specialty</label>
                <input required value={doctorForm.specialty}
                  onChange={e => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
                  placeholder="Enter specialty" />

                <label>Department</label>
                <select value={doctorForm.department}
                  onChange={e => setDoctorForm({ ...doctorForm, department: e.target.value })}>
                  {departments.map(d => (
                    <option key={d.id}>{d.name}</option>
                  ))}
                </select>

                <label>Phone</label>
                <input required value={doctorForm.phone}
                  onChange={e => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                  placeholder="Enter phone number" />

                <label>Email</label>
                <input required type="email" value={doctorForm.email}
                  onChange={e => setDoctorForm({ ...doctorForm, email: e.target.value })}
                  placeholder="Enter email" />

                <label>Experience</label>
                <input required value={doctorForm.experience}
                  onChange={e => setDoctorForm({ ...doctorForm, experience: e.target.value })}
                  placeholder="e.g. 5 Years" />
              </>
            )}

            {/* APPOINTMENT FORM */}

            {active === "Appointments" && (
              <>
                <label>Select Patient</label>
                <select required value={appointmentForm.patientId}
                  onChange={e => setAppointmentForm({ ...appointmentForm, patientId: e.target.value })}>
                  <option value="">Choose a patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>{patient.name}</option>
                  ))}
                </select>

                <label>Select Doctor</label>
                <select required value={appointmentForm.doctorId}
                  onChange={e => setAppointmentForm({ ...appointmentForm, doctorId: e.target.value })}>
                  <option value="">Choose a doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} — {doctor.department}
                    </option>
                  ))}
                </select>

                <label>Appointment Date</label>
                <input required type="date" value={appointmentForm.date}
                  onChange={e => setAppointmentForm({ ...appointmentForm, date: e.target.value })} />

                <label>Appointment Time</label>
                <input required type="time" value={appointmentForm.time}
                  onChange={e => setAppointmentForm({ ...appointmentForm, time: e.target.value })} />

                <label>Appointment Status</label>
                <select value={appointmentForm.status}
                  onChange={e => setAppointmentForm({
                    ...appointmentForm,
                    status: e.target.value as Appointment["status"]
                  })}>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                {(patients.length === 0 || doctors.length === 0) && (
                  <p className="empty-state">
                    Add at least one patient and one doctor before creating an appointment.
                  </p>
                )}
              </>
            )}

            {/* DEPARTMENT FORM */}

            {active === "Departments" && (
              <>
                <label>Department Name</label>
                <input required value={departmentForm.name}
                  onChange={e => setDepartmentForm({ ...departmentForm, name: e.target.value })}
                  placeholder="Enter department name" />

                <label>Description</label>
                <input required value={departmentForm.description}
                  onChange={e => setDepartmentForm({ ...departmentForm, description: e.target.value })}
                  placeholder="Describe this department" />

                <label>Number of Doctors</label>
                <input required type="number" min="0" value={departmentForm.doctors}
                  onChange={e => setDepartmentForm({ ...departmentForm, doctors: e.target.value })} />

                <label>Department Icon (emoji)</label>
                <input value={departmentForm.icon}
                  onChange={e => setDepartmentForm({ ...departmentForm, icon: e.target.value })}
                  placeholder="Example: 🏥" />

                <label>Status</label>
                <select value={departmentForm.status}
                  onChange={e => setDepartmentForm({
                    ...departmentForm,
                    status: e.target.value as Department["status"]
                  })}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </>
            )}

            <p className="modal-note">
              Demonstration data only. Records are not saved to a database.
            </p>

            <button className="primary-button modal-submit" type="submit"
              disabled={active === "Appointments" && (patients.length === 0 || doctors.length === 0)}>
              <Plus size={18} />
              Save Record
            </button>
          </form>
        </div>
      )}

      {/* VIEW PATIENT / DOCTOR */}

      {viewRecord && (
        <div className="modal-backdrop" onClick={() => setViewRecord(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-heading">
              <h2>Record Details</h2>
              <button onClick={() => setViewRecord(null)}><X /></button>
            </div>

            {"age" in viewRecord ? (
              <>
                <p><strong>Name:</strong> {viewRecord.name}</p>
                <p><strong>Age:</strong> {viewRecord.age}</p>
                <p><strong>Gender:</strong> {viewRecord.gender}</p>
                <p><strong>Phone:</strong> {viewRecord.phone}</p>
                <p><strong>Condition:</strong> {viewRecord.condition}</p>
              </>
            ) : (
              <>
                <p><strong>Name:</strong> {viewRecord.name}</p>
                <p><strong>Specialty:</strong> {viewRecord.specialty}</p>
                <p><strong>Department:</strong> {viewRecord.department}</p>
                <p><strong>Phone:</strong> {viewRecord.phone}</p>
                <p><strong>Email:</strong> {viewRecord.email}</p>
                <p><strong>Experience:</strong> {viewRecord.experience}</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* VIEW APPOINTMENT */}

      {viewAppointment && (
        <div className="modal-backdrop" onClick={() => setViewAppointment(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-heading">
              <h2>Appointment Details</h2>
              <button onClick={() => setViewAppointment(null)}><X /></button>
            </div>

            <p><strong>Patient:</strong> {viewAppointment.patient}</p>
            <p><strong>Doctor:</strong> {viewAppointment.doctor}</p>
            <p><strong>Department:</strong> {viewAppointment.department}</p>
            <p><strong>Date:</strong> {viewAppointment.date}</p>
            <p><strong>Time:</strong> {viewAppointment.time}</p>
            <p><strong>Status:</strong> {viewAppointment.status}</p>
            <p className="modal-note">Demonstration appointment record.</p>
          </div>
        </div>
      )}

      {/* VIEW DEPARTMENT */}

      {viewDepartment && (
        <div className="modal-backdrop" onClick={() => setViewDepartment(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-heading">
              <h2>Department Details</h2>
              <button onClick={() => setViewDepartment(null)}><X /></button>
            </div>

            <p><strong>Department:</strong> {viewDepartment.icon} {viewDepartment.name}</p>
            <p><strong>Description:</strong> {viewDepartment.description}</p>
            <p><strong>Doctors:</strong> {viewDepartment.doctors}</p>
            <p><strong>Status:</strong> {viewDepartment.status}</p>
          </div>
        </div>
      )}

    </div>
  );
}
