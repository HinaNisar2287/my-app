
"use client";

import { useState } from "react";
import {
  Search, Plus, Users, Eye, Pencil, Trash2,
  X, UserRound, Phone, Mail, MapPin
} from "lucide-react";

type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  blood: string;
  condition: string;
};

const initialPatients: Patient[] = [
  {
    id: "PAT-001",
    name: "Ali Ahmed",
    age: 35,
    gender: "Male",
    phone: "03001234567",
    email: "ali@example.com",
    blood: "A+",
    condition: "Cardiology",
  },
  {
    id: "PAT-002",
    name: "Ayesha Noor",
    age: 28,
    gender: "Female",
    phone: "03011234567",
    email: "ayesha@example.com",
    blood: "B+",
    condition: "Neurology",
  },
  {
    id: "PAT-003",
    name: "Hamza Malik",
    age: 42,
    gender: "Male",
    phone: "03021234567",
    email: "hamza@example.com",
    blood: "O+",
    condition: "Pediatrics",
  },
  {
    id: "PAT-004",
    name: "Zara Iqbal",
    age: 31,
    gender: "Female",
    phone: "03031234567",
    email: "zara@example.com",
    blood: "AB+",
    condition: "Orthopedics",
  },
];

export default function PatientsPage() {
  const [patients, setPatients] = useState(initialPatients);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [editing, setEditing] = useState<string | null>(null);

  const emptyForm = {
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    email: "",
    blood: "Unknown",
    condition: "General Medicine",
  };

  const [form, setForm] = useState(emptyForm);

  const filtered = patients.filter((p) =>
    `${p.name} ${p.id} ${p.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function savePatient(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data: Patient = {
      id: editing || `PAT-${String(Date.now()).slice(-6)}`,
      name: form.name,
      age: Number(form.age),
      gender: form.gender,
      phone: form.phone,
      email: form.email,
      blood: form.blood,
      condition: form.condition,
    };

    if (editing) {
      setPatients((old) =>
        old.map((p) => p.id === editing ? data : p)
      );
    } else {
      setPatients((old) => [...old, data]);
    }

    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
  }

  function editPatient(patient: Patient) {
    setForm({
      name: patient.name,
      age: String(patient.age),
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      blood: patient.blood,
      condition: patient.condition,
    });
    setEditing(patient.id);
    setShowForm(true);
  }

  function deletePatient(id: string) {
    if (window.confirm("Delete this demonstration patient record?")) {
      setPatients((old) => old.filter((p) => p.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  }

  return (
    <div className="patients-page">

      <div className="patients-heading">
        <div>
          <p className="eyebrow">HOSPITAL MANAGEMENT</p>
          <h1>Patient Management</h1>
          <p className="subtitle">
            Register, search and manage patient records.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            setForm(emptyForm);
            setEditing(null);
            setShowForm(true);
          }}
        >
          <Plus size={18} /> Register Patient
        </button>
      </div>

      <div className="patient-stats">
        <div className="patient-stat">
          <Users size={24} />
          <div>
            <p>Total Patients</p>
            <h2>{patients.length}</h2>
          </div>
        </div>

        <div className="patient-stat">
          <UserRound size={24} />
          <div>
            <p>Male Patients</p>
            <h2>{patients.filter(p => p.gender === "Male").length}</h2>
          </div>
        </div>

        <div className="patient-stat">
          <Users size={24} />
          <div>
            <p>Female Patients</p>
            <h2>{patients.filter(p => p.gender === "Female").length}</h2>
          </div>
        </div>
      </div>

      <div className="panel patient-table-panel">
        <div className="patient-toolbar">
          <div>
            <h3>All Patients</h3>
            <p>Patient directory · Demonstration data</p>
          </div>

          <div className="patient-search">
            <Search size={17} />
            <input
              placeholder="Search name, ID or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Age / Gender</th>
                <th>Phone</th>
                <th>Blood Group</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td><strong>{patient.name}</strong></td>
                  <td>{patient.age} / {patient.gender}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.blood}</td>
                  <td>{patient.condition}</td>
                  <td>
                    <div className="patient-actions">
                      <button title="View" onClick={() => setSelected(patient)}>
                        <Eye size={16} />
                      </button>
                      <button title="Edit" onClick={() => editPatient(patient)}>
                        <Pencil size={16} />
                      </button>
                      <button title="Delete" onClick={() => deletePatient(patient.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="empty-state">No patients found.</p>
          )}
        </div>
      </div>

      {showForm && (
        <div className="modal-backdrop">
          <form className="modal patient-form" onSubmit={savePatient}>
            <div className="modal-heading">
              <h2>{editing ? "Edit Patient" : "Register New Patient"}</h2>
              <button type="button" onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>

            <label>Patient Full Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({...form, name:e.target.value})}
              placeholder="Enter full name"
            />

            <div className="form-grid">
              <div>
                <label>Age</label>
                <input
                  required
                  type="number"
                  min="0"
                  max="120"
                  value={form.age}
                  onChange={(e) => setForm({...form, age:e.target.value})}
                />
              </div>

              <div>
                <label>Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({...form, gender:e.target.value})}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <label>Phone Number</label>
            <input
              required
              value={form.phone}
              onChange={(e) => setForm({...form, phone:e.target.value})}
              placeholder="Enter phone number"
            />

            <label>Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({...form, email:e.target.value})}
              placeholder="Enter email"
            />

            <div className="form-grid">
              <div>
                <label>Blood Group</label>
                <select
                  value={form.blood}
                  onChange={(e) => setForm({...form, blood:e.target.value})}
                >
                  {["Unknown","A+","A-","B+","B-","O+","O-","AB+","AB-"].map(x =>
                    <option key={x}>{x}</option>
                  )}
                </select>
              </div>

              <div>
                <label>Department</label>
                <select
                  value={form.condition}
                  onChange={(e) => setForm({...form, condition:e.target.value})}
                >
                  {["General Medicine","Cardiology","Neurology","Pediatrics","Orthopedics"].map(x =>
                    <option key={x}>{x}</option>
                  )}
                </select>
              </div>
            </div>

            <button className="primary-button modal-submit" type="submit">
              {editing ? "Update Patient" : "Save Patient"}
            </button>
          </form>
        </div>
      )}

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-heading">
              <h2>Patient Profile</h2>
              <button onClick={() => setSelected(null)}><X /></button>
            </div>

            <h3>{selected.name}</h3>
            <p>Patient ID: {selected.id}</p>
            <p><UserRound size={16} /> {selected.age} years · {selected.gender}</p>
            <p><Phone size={16} /> {selected.phone}</p>
            <p><Mail size={16} /> {selected.email || "Not provided"}</p>
            <p><MapPin size={16} /> {selected.condition}</p>
            <p>Blood group: {selected.blood}</p>
            <p className="modal-note">
              Demonstration profile. This is not a verified medical record.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
