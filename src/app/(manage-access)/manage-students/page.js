"use client"
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/components/Navbar/Navbar';
import Breadcrumbs from '@/components/Common/Breadcrumbs';
import renewAccessToken from '@/lib/token/renewAccessToken';

// Constants
const BREADCRUMB_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Manage Students", href: "/manage-students" },
];

const INITIAL_FORM_STATE = {
  studentEmail: "",
  studentFirstName: "",
  studentLastName: "",
};

function ManageStudents() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [students, setStudents] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [subjectInputMethod, setSubjectInputMethod] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = await renewAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/access/get-all-students`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
      if (!response.ok) {
        toast.error("No Students Added Till Now");
        return;
      }

      const data = await response.json();
      setStudents(data.data.users);
    } catch (error) {
      // toast.error("Failed to load students");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === "studentEmail" && value) {
      setSubjectInputMethod("existing");
      setNewSubject("");
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleNewSubjectChange = (e) => {
    const value = e.target.value;
    setNewSubject(value);
    if (value) {
      setSubjectInputMethod("new");
      setFormData(prev => ({ ...prev, studentEmail: "" }));
    } else {
      setSubjectInputMethod(null);
    }
    if (errors.subject) {
      setErrors(prev => ({ ...prev, subject: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = await renewAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/access/provide-student-access`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            studentEmail: subjectInputMethod === "new" ? newSubject : formData.studentEmail,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload resource");
      }

      toast.success("Resource uploaded successfully!");
      setFormData(INITIAL_FORM_STATE);
      setNewSubject("");
      setSubjectInputMethod(null);
    } catch (error) {
      toast.error(error.message || "Failed to upload resource. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem' }}>
          <div style={{ marginTop: '4rem' }}>
            <Breadcrumbs items={BREADCRUMB_ITEMS} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black' }}>
              Add/Revoke Student Access
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              maxWidth: '56rem',
              margin: '1.5rem auto',
              padding: '1.5rem',
              backgroundColor: 'white',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              borderRadius: '0.375rem',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              Manage Students
            </h2>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="studentEmail" style={{ display: 'block', color: '#374151', marginBottom: '0.5rem' }}>
                Student Email
              </label>
              <select
                name="studentEmail"
                id="studentEmail"
                value={formData.studentEmail}
                onChange={handleChange}
                disabled={subjectInputMethod === "new"}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: `1px solid ${errors.subject ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '0.375rem',
                  backgroundColor: subjectInputMethod === "new" ? '#f3f4f6' : 'white',
                }}
              >
                <option value="">Select Student</option>
                {students.map((subject) => (
                  <option key={subject._id} value={subject.email}>
                    {subject.email}
                  </option>
                ))}
              </select>

              <div style={{ marginTop: '0.5rem' }}>
                <input
                  type="email"
                  placeholder="Enter new student email address"
                  value={newSubject}
                  onChange={handleNewSubjectChange}
                  disabled={subjectInputMethod === "existing"}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: `1px solid ${errors.subject ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '0.375rem',
                    backgroundColor: subjectInputMethod === "existing" ? '#f3f4f6' : 'white',
                  }}
                />
              </div>
              {errors.subject && (
                <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ef4444' }} role="alert">
                  {errors.subject}
                </p>
              )}
              {subjectInputMethod && (
                <button
                  type="button"
                  onClick={() => {
                    setSubjectInputMethod(null);
                    setNewSubject("");
                    setFormData(prev => ({ ...prev, studentEmail: "" }));
                  }}
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#3b82f6',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Clear selection
                </button>
              )}
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: isLoading ? '#60a5fa' : '#3b82f6',
                  color: 'white',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                }}
              >
                {isLoading ? "Loading..." : "Give Access"}
              </button>
            </div>
          </form>
        </div>
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </>
  );
}

export default ManageStudents;