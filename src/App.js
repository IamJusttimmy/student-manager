import { useState, useEffect } from "react";

// const initalData = [
//   {
//     id: "20200001",
//     name: "John Smith",
//     attendance: { mon: "", tue: "", wed: "", thu: "", fri: "" },
//   },
//   {
//     id: "20200002",
//     name: "Sarah Johnson",
//     attendance: { mon: "", tue: "", wed: "", thu: "", fri: "" },
//   },
//   {
//     id: "20200003",
//     name: "Mike Brown",
//     attendance: { mon: "", tue: "", wed: "", thu: "", fri: "" },
//   },
//   {
//     id: "20200004",
//     name: "Emma Davis",
//     attendance: { mon: "", tue: "", wed: "", thu: "", fri: "" },
//   },
//   {
//     id: "20200005",
//     name: "Alex Wilson",
//     attendance: { mon: "", tue: "", wed: "", thu: "", fri: "" },
//   },
//   {
//     id: "20200006",
//     name: "Alice Doe",
//     attendance: { mon: "", tue: "", wed: "", thu: "", fri: "" },
//   },
//   {
//     id: "20200007",
//     name: "Bob Smith",
//     attendance: { mon: "", tue: "", wed: "", thu: "", fri: "" },
//   },

//   {
//     id: "20200008",
//     name: "Lisa Chen",
//     attendance: { mon: "", tue: "", wed: "", thu: "", fri: "" },
//   },
//   {
//     id: "20200009",
//     name: "David Kim",
//     attendance: { mon: "", tue: "", wed: "", thu: "", fri: "" },
//   },
//   {
//     id: "20200010",
//     name: "Maria Garcia",
//     attendance: { mon: "", tue: "", wed: "", thu: "", fri: "" },
//   },
// ];

export default function () {
  const [students, setStudents] = useState(function () {
    const storedValue = localStorage.getItem("students");
    if (storedValue) {
      return JSON.parse(storedValue);
    }
    return [];
  });
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  // Pagination calculations
  const totalPages = Math.ceil(students.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  const currentStudents = students.slice(startIndex, endIndex);

  function handlePageChange(page) {
    setCurrentPage(page);
  }

  function handlePrevPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function handleNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  function handleAddStudent(student) {
    const existingStudent = students.find((s) => s.id === student.id);
    if (existingStudent) {
      alert("A student with this ID already exists!");
      return;
    }
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

  function handleDeleteStudent(id) {
    if (window.confirm("Are you sure you want to remove student?")) {
      setStudents((student) => student.filter((student) => student.id !== id));
    }
  }

  function handleResetAttendance() {
    if (window.confirm("Want to reset all attendance for a new week?")) {
      setStudents((students) =>
        students.map((student) => ({
          ...student,
          attendance: { mon: "", tue: "", wed: "", thu: "", fri: "" },
        }))
      );
    }
  }

  useEffect(
    function () {
      localStorage.setItem("students", JSON.stringify(students));
    },
    [students]
  );

  return (
    <div className="container">
      <Header students={students} onResetAttendance={handleResetAttendance} />
      <Main
        students={currentStudents}
        onAddStdent={handleAddStudent}
        onAttendanceClick={handleAttendanceClick}
        onDeleteStudent={handleDeleteStudent}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />
    </div>
  );
}

function Header({ students, onResetAttendance }) {
  return (
    <div className="app-header">
      <h1>📚 Student Attendance Management</h1>
      <div className="header-info">
        <div className="blah">
          <p>Track and Manage Student's Attendance Efficiently.</p>
          <p className="student-count">Total Students: {students.length}</p>
        </div>
        <button className="reset-btn" onClick={onResetAttendance}>
          Reset Attendance
        </button>
      </div>
    </div>
  );
}

function Main({ students, onAddStdent, onAttendanceClick, onDeleteStudent }) {
  return (
    <div className="main-content">
      {students.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Matric Number</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <Student
                  key={student.id}
                  student={student}
                  onAttendanceClick={onAttendanceClick}
                  onDeleteStudent={onDeleteStudent}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>No students found. Add your first student below!</p>
        </div>
      )}

      <AddStudentForm onAddStdent={onAddStdent} />
    </div>
  );
}

function Student({ student, onAttendanceClick, onDeleteStudent }) {
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
      <td>
        <button
          className="delete-btn"
          onClick={() => onDeleteStudent(student.id)}
        >
          ❌
        </button>
      </td>
    </tr>
  );
}

function AddStudentForm({ onAddStdent }) {
  const [addStudentName, setAddStudentName] = useState("");
  const [addStudentid, setAddStudentid] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!addStudentName || !addStudentid) {
      alert("Please fill in all fields to add student");
      return;
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
        placeholder="Student Name"
        value={addStudentName}
        onChange={(e) => setAddStudentName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Matric Number"
        value={addStudentid}
        onChange={(e) => setAddStudentid(e.target.value)}
      />
      <button type="submit" className="add-btn">
        Add Student
      </button>
    </form>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onPrevPage,
  onNextPage,
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 4;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="pagination">
      <button onClick={onPrevPage} disabled={currentPage === 1}>
        Prev
      </button>

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={index} className="pagination-ellipsis">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={currentPage === page ? "active" : ""}
          >
            {page}
          </button>
        )
      )}

      <button onClick={onNextPage} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
}
