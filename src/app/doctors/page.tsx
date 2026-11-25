
"use client";

import { useState } from "react";
import {
  Search, Plus, Stethoscope, Phone, Mail,
  MapPin, Pencil, Trash2, Eye, X
} from "lucide-react";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  department: string;
  experience: string;
  status: string;
};

const initialDoctors: Doctor[] = [
  {
    id: "DOC-001",
    name: "Dr. Sarah Khan",
    specialty: "Cardiologist",
    phone: "0300-1111111",
    email: "sarah@example.com",
    department: "Cardiology",
    experience: "10 Years",
    status: "Available",
  },
  {
    id: "DOC-002",
    name: "Dr. Usman Ali",
    specialty: "Neurologist",
    phone: "0300-2222222",
    email: "usman@example.com",
    department: "Neurology",
    experience: "8 Years",
    status: "Available",
  },
  {
    id: "DOC-003",
    name: "Dr. Fatima Noor",
    specialty: "Pediatrician",
    phone: "0300-3333333",
    email: "fatima@example.com",
    department: "Pediatrics",
    experience: "6 Years",
    status: "On Leave",
  },
];

const emptyForm = {
  name: "",
  specialty: "",
  phone: "",
  email: "",
  department: "",
  experience: "",
  status: "Available",
};

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filteredDoctors = doctors.filter((doctor) =>
    [
      doctor.name,
      doctor.specialty,
      doctor.department,
      doctor.id,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function openAddForm() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function saveDoctor(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (editing) {
      setDoctors((previous) =>
        previous.map((doctor) =>
          doctor.id === editing
            ? { ...doctor, ...form }
            : doctor
        )
      );
    } else {
      const newDoctor: Doctor = {
        id: `DOC-${String(Date.now()).slice(-6)}`,
        ...form,
      };

      setDoctors((previous) => [...previous, newDoctor]);
    }

    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
  }

  function editDoctor(doctor: Doctor) {
    setEditing(doctor.id);
    setForm({
      name: doctor.name,
      specialty: doctor.specialty,
      phone: doctor.phone,
      email: doctor.email,
      department: doctor.department,
      experience: doctor.experience,
      status: doctor.status,
    });
    setShowForm(true);
    setSelected(null);
  }

  function deleteDoctor(id: string) {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      setDoctors((previous) =>
        previous.filter((doctor) => doctor.id !== id)
      );
    }
  }

  return (
    <main className="doctors-page">
      <div className="doctors-heading">
        <div>
          <p className="eyebrow">HOSPITAL STAFF</p>
          <h1>Doctor Management</h1>
          <p className="subtitle">
            Manage doctor profiles and professional information.
          </p>
        </div>

        <button className="primary-button" onClick={openAddForm}>
          <Plus size={18} /> Add Doctor
        </button>
      </div>

      <section className="doctor-stats">
        <div className="doctor-stat">
          <Stethoscope size={24} />
          <div>
            <p>Total Doctors</p>
            <h2>{doctors.length}</h2>
          </div>
        </div>

        <div className="doctor-stat">
          <div>
            <p>Available Doctors</p>
            <h2>
              {doctors.filter((d) => d.status === "Available").length}
            </h2>
          </div>
        </div>

        <div className="doctor-stat">
          <div>
            <p>Departments Covered</p>
            <h2>{new Set(doctors.map((d) => d.department)).size}</h2>
          </div>
        </div>
      </section>

      <section className="panel doctor-list-panel">
        <div className="panel-heading">
          <div>
            <h3>Doctors Directory</h3>
            <p>Doctor records · Demonstration data</p>
          </div>
        </div>

        <div className="doctor-search">
          <Search size={18} />
          <input
            placeholder="Search by doctor name, ID or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Specialty</th>
                <th>Department</th>
                <th>Experience</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td>
                    <strong>{doctor.name}</strong>
                    <br />
                    <small>{doctor.id}</small>
                  </td>
                  <td>{doctor.specialty}</td>
                  <td>{doctor.department}</td>
                  <td>{doctor.experience}</td>
                  <td>
                    <span
                      className={`status ${
                        doctor.status === "Available"
                          ? "confirmed"
                          : "pending"
                      }`}
                    >
                      {doctor.status}
                    </span>
                  </td>
                  <td>
                    <div className="doctor-actions">
                      <button
                        title="View"
                        onClick={() => setSelected(doctor)}
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        title="Edit"
                        onClick={() => editDoctor(doctor)}
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        title="Delete"
                        onClick={() => deleteDoctor(doctor.id)}
                      >
                        <Trash2 size={17} />
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

      {showForm && (
        <div
          className="modal-backdrop"
          onClick={() => setShowForm(false)}
        >
          <form
            className="modal doctor-modal"
            onSubmit={saveDoctor}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-heading">
              <h2>{editing ? "Edit Doctor" : "Register New Doctor"}</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
              >
                <X />
              </button>
            </div>

            <div className="doctor-form-grid">
              <label>
                Doctor Name
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Dr. Full Name"
                />
              </label>

              <label>
                Specialty
                <input
                  required
                  value={form.specialty}
                  onChange={(e) =>
                    setForm({ ...form, specialty: e.target.value })
                  }
                  placeholder="e.g. Cardiologist"
                />
              </label>

              <label>
                Phone
                <input
                  required
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  placeholder="Phone number"
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="doctor@example.com"
                />
              </label>

              <label>
                Department
                <input
                  required
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                  placeholder="Department"
                />
              </label>

              <label>
                Experience
                <input
                  required
                  value={form.experience}
                  onChange={(e) =>
                    setForm({ ...form, experience: e.target.value })
                  }
                  placeholder="e.g. 5 Years"
                />
              </label>

              <label>
                Status
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  <option>Available</option>
                  <option>On Leave</option>
                </select>
              </label>
            </div>

            <button className="primary-button modal-submit" type="submit">
              <Plus size={18} />
              {editing ? "Update Doctor" : "Save Doctor"}
            </button>
          </form>
        </div>
      )}

      {selected && (
        <div
          className="modal-backdrop"
          onClick={() => setSelected(null)}
        >
          <div
            className="modal doctor-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-heading">
              <h2>Doctor Profile</h2>
              <button onClick={() => setSelected(null)}>
                <X />
              </button>
            </div>

            <h2>{selected.name}</h2>
            <p>{selected.specialty}</p>
            <p><Stethoscope size={17} /> {selected.department}</p>
            <p><Phone size={17} /> {selected.phone}</p>
            <p><Mail size={17} /> {selected.email}</p>
            <p><MapPin size={17} /> {selected.experience} experience</p>
            <p>Status: {selected.status}</p>

            <button
              className="primary-button"
              onClick={() => editDoctor(selected)}
            >
              <Pencil size={17} /> Edit Profile
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
