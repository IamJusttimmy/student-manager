import { useState, useEffect } from "react";

const initalData = [
  {
    id: "20200001",
    name: "John Smith",
    attendance: { mon: "", tue: "", wed: "", thu: "", fri: "" },
  },
  {
    id: "20200002",
    name: "Sarah Johnson",
    attendance: { mon: "", tue: "", wed: "", thu: "", fri: "" },
  },
  {
    id: "20200003",
    name: "Mike Brown",
    attendance: { mon: "", tue: "", wed: "", thu: "", fri: "" },
  },
  {
    id: "20200004",
    name: "Emma Davis",
    attendance: { mon: "", tue: "", wed: "", thu: "", fri: "" },
  },
  {
    id: "20200005",
    name: "Alex Wilson",
    attendance: { mon: "", tue: "", wed: "", thu: "", fri: "" },
  },
  {
    id: "20200006",
    name: "Alice Doe",
    attendance: { mon: "", tue: "", wed: "", thu: "", fri: "" },
  },
  {
    id: "20200007",
    name: "Bob Smith",
    attendance: { mon: "", tue: "", wed: "", thu: "", fri: "" },
  },
];

export default function () {
  const [students, setStudents] = useState(function () {
    const storedValue = localStorage.getItem("students");
    if (storedValue) {
      return JSON.parse(storedValue);
    }
    return initalData;
  });

  function handleAddStudent(student) {
    setStudents((students) => [...students, student]);
  }

  function handleAttendanceClick(studentId, day) {
    setStudents((currentStudents) => {
      return currentStudents.map((student) => {
        if (student.id === studentId) {
          const newStatus =
            student.attendance[day] === "P"
              ? "A"
              : student.attendance[day] === "A"
              ? ""
              : "P";
          return {
            ...student,
            attendance: {
              ...student.attendance,
              [day]: newStatus,
            },
          };
        }

        return student;
      });
    });
  }

  useEffect(
    function () {
      localStorage.setItem("students", JSON.stringify(students));
    },
    [students]
  );

  return (
    <>
      <Header students={students} />
      <Main
        students={students}
        onAddStdent={handleAddStudent}
        onAttendanceClick={handleAttendanceClick}
      />
      <Pagination />
    </>
  );
}

function Header({ students }) {
  return (
    <div>
      <h1>📚Student Attendance Management</h1>
      <div className="header">
        <p>Track and Manage Student's Attendance Efficiently.</p>
        <span>Total Student: {students.length}</span>
      </div>
    </div>
  );
}

function Main({ students, onAddStdent, onAttendanceClick }) {
  return (
    <div className="main-content">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>MATRIC NUMBER</th>
              <th>MON</th>
              <th>TUE</th>
              <th>WED</th>
              <th>THU</th>
              <th>FRI</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <Student
                key={student.id}
                student={student}
                onAttendanceClick={onAttendanceClick}
              />
            ))}
          </tbody>
        </table>
      </div>

      <AddStudentForm onAddStdent={onAddStdent} />
    </div>
  );
}

function Student({ student, onAttendanceClick }) {
  const weekdays = ["mon", "tue", "wed", "thu", "fri"];

  return (
    <tr>
      <td>{student.name}</td>
      <td>{student.id}</td>
      {weekdays.map((day) => (
        <td
          key={day}
          onClick={() => onAttendanceClick(student.id, day)}
          className={`attendance-cell ${student.attendance[day]}`}
        >
          {student.attendance[day]}
        </td>
      ))}
      {/* <td>{student.attendance.mon}</td>
      <td>{student.attendance.tue}</td>
      <td>{student.attendance.wed}</td>
      <td>{student.attendance.thu}</td>
      <td>{student.attendance.fri}</td> */}
    </tr>
  );
}

function AddStudentForm({ onAddStdent }) {
  const [addStudentName, setAddStudentName] = useState("");
  const [addStudentid, setAddStudentid] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!addStudentName || !addStudentid) {
      window.confirm("Please fill in all fields to add student");
    }

    const newStudent = {
      id: addStudentid,
      name: addStudentName,
      attendance: { mon: "", tue: "", wed: "", thu: "", fri: "" },
    };

    onAddStdent(newStudent);
    setAddStudentName("");
    setAddStudentid("");
  }

  return (
    <form className="add-student-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={addStudentName}
        onChange={(e) => setAddStudentName(e.target.value)}
      />
      <input
        type="number"
        placeholder="ID"
        value={addStudentid}
        onChange={(e) => setAddStudentid(e.target.value)}
      />
      <button type="submit">Add Student</button>
    </form>
  );
}

function Pagination() {
  return (
    <div className="pagination">
      <button>Prev</button>
      {/* <span>[1][2][3]</span> */}
      <button>1</button>
      <button>2</button>
      <button>3</button>
      <button>Next</button>
    </div>
  );
}
