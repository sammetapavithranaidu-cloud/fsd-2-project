
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Student Details
let students = [
    {
        id: 1,
        name: "Pavithra",
        rollno: "101",
        department: "CSE",
        year: "3rd Year",
        marks: 85
    },
    {
        id: 2,
        name: "Ravi",
        rollno: "102",
        department: "ECE",
        year: "3rd Year",
        marks: 90
    },
    {
        id: 3,
        name: "Sita",
        rollno: "103",
        department: "IT",
        year: "3rd Year",
        marks: 95
    }
];

// Get Students
app.get("/api/students", (req, res) => {
    res.json(students);
});

// Add Student
app.post("/api/students", (req, res) => {
    const student = {
        id: Date.now(),
        ...req.body
    };

    students.push(student);

    res.json(student);
});

// Update Student
app.put("/api/students/:id", (req, res) => {
    const id = Number(req.params.id);

    students = students.map(student =>
        student.id === id
            ? { ...student, ...req.body, id }
            : student
    );

    res.json({ message: "Student updated successfully" });
});

// Delete Student
app.delete("/api/students/:id", (req, res) => {
    const id = Number(req.params.id);

    students = students.filter(student => student.id !== id);

    res.json({ message: "Student deleted successfully" });
});

// Start Server
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
