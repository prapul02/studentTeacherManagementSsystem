const express = require("express");
const teachers = require("../models/teacherData.js");

const teachersRouter = express.Router();

const getAllTeachers = () => teachers;

const getTeacherById = id => {
  const teachers = getAllTeachers();
  return teachers.find(each => each.teacherId === id);
};

const getStudentById = (id, studentId) => {
  const teachers = getAllTeachers();
  const teacher = teachers.find(each => each.teacherId === id);
  return teacher.students.find(each => each.studentId === studentId);
};

// get teachers
teachersRouter.get("/", (req, res) => {
  res.status(200).json({
    data: getAllTeachers()
  });
});

// post teachers
teachersRouter.post("/", (req, res) => {
  if (req.body.age && req.body.firstName) {
    teachers.push(req.body);
    res.status(200).json({
      message: "record added successfully"
    });
  } else {
    res.status(400).send("invalid request");
  }
});

// put teachers
teachersRouter.put("/", (req, res) => {
  if (req.body.teacherId && req.body.firstName) {
    teachers.length = 0;
    teachers.push(req.body);
    res.status(200).json({
      message: "record updated successfully"
    });
  } else {
    res.status(400).send("invalid request");
  }
});

// delete teachers
teachersRouter.delete("/", (req, res) => {
  teachers.length = 0;
  res.status(200).json({
    message: "records deleted successfully"
  });
});

// get teachers by id
teachersRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const requiredTeacher = getTeacherById(parseInt(id, 10));
  if (requiredTeacher) {
    res.status(200).json({ data: requiredTeacher });
  } else {
    res.status(400).send("teacher unavailable");
  }
});

// put teacher by id
teachersRouter.put("/:id", (req, res) => {
  const { id } = req.params;
  const teacherId = parseInt(id, 10);
  let requiredTeacherIndex;
  for (let i = 0; i < teachers.length; i++) {
    if (teachers[i].teacherId === teacherId) {
      requiredTeacherIndex = i;
      break;
    }
  }
  if (typeof requiredTeacherIndex !== "undefined") {
    const originalTeacher = teachers[requiredTeacherIndex];
    const newTeacher = {
      ...originalTeacher,
      ...req.body
    };
    teachers.splice(requiredTeacherIndex, 1, newTeacher);
    res.status(200).json({
      message: "Teacher details updated!",
      data: newTeacher
    });
  } else {
    res.status(400).send("Invalid Teacher");
  }
});

//delete teacher by id
teachersRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  const teacherId = parseInt(id, 10);
  let requiredTeacherIndex;
  for (let i = 0; i < teachers.length; i++) {
    if (teachers[i].teacherId === teacherId) {
      requiredTeacherIndex = i;
      break;
    }
  }
  if (typeof requiredTeacherIndex !== "undefined") {
    teachers.splice(requiredTeacherIndex, 1);
    res.status(200).json({
      message: "teacher has been deleted"
    });
  } else {
    res.status(400).send("Invalid Teacher");
  }
});

// get student by studentId and teacherId
teachersRouter.get("/:id/students/:studentId", (req, res) => {
  const { id } = req.params;
  const { studentId } = req.params;
  const requiredStudent = getStudentById(
    parseInt(id, 10),
    parseInt(studentId, 10)
  );
  if (requiredStudent) {
    res.status(200).json({ data: requiredStudent });
  } else {
    res.status(400).send("student unavailable");
  }
});

// put student by teacherid and studentID
teachersRouter.put("/:id/students/:studentId", (req, res) => {
  const { id } = req.params;
  const { studentId } = req.params;
  const teacherId = parseInt(id, 10);
  const studentsId = parseInt(studentId, 10);
  let requiredTeacherIndex;
  for (let i = 0; i < teachers.length; i++) {
    if (teachers[i].teacherId === teacherId) {
      requiredTeacherIndex = i;
      break;
    }
  }
  if (typeof requiredTeacherIndex !== "undefined") {
    let requiredStudentIndex;
    let originalStudent;
    for (let i = 0; i < teachers[requiredTeacherIndex].length; i++) {
      if (teachers[requiredTeacherIndex].students.studentId === studentsId) {
        requiredStudentIndex = i;
        originalStudent =
          teachers[requiredTeacherIndex].students[requiredStudentIndex];
      }
    }

    let newStudent = {
      ...originalStudent,
      ...req.body
    };
    teachers[requiredTeacherIndex].students.splice(
      requiredStudentIndex,
      1,
      newStudent
    );
    res.status(200).json({
      message: "Student details updated!",
      data: newStudent
    });
  } else {
    res.status(400).send("Invalid Student");
  }
});

//delete student by id and studentId
teachersRouter.delete("/:id/students/:studentId", (req, res) => {
  const { id } = req.params;
  const { studentId } = req.params;
  const studentsId = parseInt(studentId, 10);
  const teacherId = parseInt(id, 10);
  let requiredTeacherIndex;
  for (let i = 0; i < teachers.length; i++) {
    if (teachers[i].teacherId === teacherId) {
      requiredTeacherIndex = i;
      break;
    }
  }
  if (typeof requiredTeacherIndex !== "undefined") {
    let requiredStudentIndex;
    for (let i = 0; i < teachers[requiredTeacherIndex].length; i++) {
      if (teachers[requiredTeacherIndex].students.studentId === studentsId) {
        requiredStudentIndex = i;
      }
    }
    teachers[requiredTeacherIndex].students.splice(requiredStudentIndex, 1);
    res.status(200).json({
      message: "student has been deleted"
    });
  } else {
    res.status(400).send("Invalid student");
  }
});

module.exports = {
  teachersRouter,
  getAllTeachers,
  getTeacherById,
  getStudentById
};
