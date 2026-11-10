
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {

    const [students, setStudents] = useState([]);

    const [name, setName] = useState("");
    const [rollno, setRollno] = useState("");
    const [department, setDepartment] = useState("");
    const [year, setYear] = useState("");
    const [marks, setMarks] = useState("");

    const [search, setSearch] = useState("");
    const [editId, setEditId] = useState(null);

    // Get Students from Express Backend
    function loadStudents() {
        fetch("http://localhost:5000/api/students")
            .then(res => {
                if (!res.ok) throw new Error("Failed to load students");
                return res.json();
            })
            .then(data => setStudents(data))
            .catch(error => console.log(error));
    }

    useEffect(() => {
        loadStudents();
    }, []);

    // Clear Form
    function clearForm() {
        setName("");
        setRollno("");
        setDepartment("");
        setYear("");
        setMarks("");
        setEditId(null);
    }

    // Add or Update Student
    function addStudent(e) {
        e.preventDefault();

        const student = {
            name,
            rollno,
            department,
            year,
            marks: Number(marks)
        };

        const url = editId
            ? `http://localhost:5000/api/students/${editId}`
            : "http://localhost:5000/api/students";

        const method = editId ? "PUT" : "POST";

        fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        })
            .then(res => {
                if (!res.ok) throw new Error("Unable to save student");
                return res.json();
            })
            .then(() => {
                alert(editId
                    ? "Student Updated Successfully!"
                    : "Student Added Successfully!"
                );

                clearForm();
                loadStudents();
            })
            .catch(error => {
                console.log(error);
                alert("Backend connection failed!");
            });
    }

    // Edit Student
    function editStudent(student) {
        setEditId(student.id);
        setName(student.name);
        setRollno(student.rollno);
        setDepartment(student.department);
        setYear(student.year);
        setMarks(student.marks);
    }

    // Delete Student
    function deleteStudent(id) {

        if (!window.confirm("Do you want to delete this student?")) {
            return;
        }

        fetch(`http://localhost:5000/api/students/${id}`, {
            method: "DELETE"
        })
            .then(res => {
                if (!res.ok) throw new Error("Delete failed");
                return res.json();
            })
            .then(() => {
                alert("Student Deleted Successfully!");
                loadStudents();
            })
            .catch(error => {
                console.log(error);
                alert("Unable to delete student!");
            });
    }

    // Search Student
    const filteredStudents = students.filter(student =>
        String(student.name).toLowerCase().includes(search.toLowerCase()) ||
        String(student.rollno).toLowerCase().includes(search.toLowerCase())
    );

    // Dashboard Calculations
    const totalMarks = students.reduce(
        (total, student) => total + Number(student.marks), 0
    );

    const averageMarks = students.length
        ? (totalMarks / students.length).toFixed(1)
        : 0;

    const highestMarks = students.length
        ? Math.max(...students.map(s => Number(s.marks)))
        : 0;

    return (
        <div className="container">

            <h1>🎓 Student Management System</h1>

            <p className="subtitle">
                Manage Student Details Easily
            </p>

            {/* Dashboard */}

            <div className="dashboard">

                <div className="card">
                    <h3>Total Students</h3>
                    <h2>{students.length}</h2>
                </div>

                <div className="card">
                    <h3>Average Marks</h3>
                    <h2>{averageMarks}</h2>
                </div>

                <div className="card">
                    <h3>Highest Marks</h3>
                    <h2>{highestMarks}</h2>
                </div>

            </div>

            {/* Add Student Form */}

            <div className="form-box">

                <h2>{editId ? "Edit Student" : "Add Student"}</h2>

                <form onSubmit={addStudent}>

                    <input
                        type="text"
                        placeholder="Student Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Roll Number"
                        value={rollno}
                        onChange={e => setRollno(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Department"
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Year"
                        value={year}
                        onChange={e => setYear(e.target.value)}
                        required
                    />

                    <input
                        type="number"
                        placeholder="Marks"
                        value={marks}
                        onChange={e => setMarks(e.target.value)}
                        min="0"
                        max="100"
                        required
                    />

                    <button type="submit">
                        {editId ? "Update Student" : "Add Student"}
                    </button>

                    <button type="button" onClick={clearForm}>
                        Clear
                    </button>

                </form>

            </div>

            {/* Student List */}

            <div className="student-box">

                <h2>Student List</h2>

                <input
                    type="text"
                    placeholder="Search by name or roll number"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                <h3>Total Students: {students.length}</h3>

                <div className="table-container">

                    <table>

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Roll No</th>
                                <th>Department</th>
                                <th>Year</th>
                                <th>Marks</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredStudents.map(student => (

                                <tr key={student.id}>

                                    <td>{student.id}</td>
                                    <td>{student.name}</td>
                                    <td>{student.rollno}</td>
                                    <td>{student.department}</td>
                                    <td>{student.year}</td>
                                    <td>{student.marks}</td>

                                    <td>
                                        <button
                                            onClick={() => editStudent(student)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete"
                                            onClick={() => deleteStudent(student.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>

                                </tr>

                            ))}

                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan="7">
                                        No Students Found
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default App;
