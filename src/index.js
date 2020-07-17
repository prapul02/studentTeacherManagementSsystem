const express = require("express");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");
const path = require("path");
const ifEquality = require("./views/helpers/ifEquality");
const {
  teachersRouter,
  getAllTeachers,
  getTeacherById,
  getStudentById
} = require("./routes/teachersRouter");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Creating handlebars engine

const hbs = expressHbs.create({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "./views/layouts"),
  partialsDir: path.join(__dirname, "./views/partials"),
  helpers: {
    ifEquality
  }
});

// Let's express know to use handlebars

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "./views"));

// Api's

app.get("/", (request, response) => {
  response.status(200).render("home", {
    layout: "hero",
    title: "Home"
  });
});

app.get("/teachers", (req, res) => {
  res.status(200).render("teachers", {
    layout: "navigation",
    title: "teacher Details",
    data: getAllTeachers()
  });
});

app.get("/add-teacher", (req, res) => {
  res.status(200).render("addTeachers", {
    layout: "navigation",
    title: "Add Teacher",
    action: "/api/teachers",
    method: "POST"
  });
});

app.get("/edit-teacher/:id", (req, res) => {
  const { id } = req.params;
  const requiredTeacher = getTeacherById(parseInt(id, 10));
  if (requiredTeacher) {
    res.status(200).render("addTeachers.hbs", {
      layout: "navigation",
      title: "Add Teacher",
      teacher: requiredTeacher,
      action: `/api/teachers/${id}`,
      method: "PUT"
    });
  } else {
    res.status(404).send("Teacher not found");
  }
});

app.get("/get-teacher/:id", (req, res) => {
  const { id } = req.params;
  const requiredTeacher = getTeacherById(parseInt(id, 10));
  if (requiredTeacher) {
    res.status(200).render("students.hbs", {
      layout: "navigation",
      title: "Add Student",
      data: requiredTeacher.students,
      action: `/api/teachers/${id}`,
      method: "GET"
    });
  } else {
    res.status(404).send("Teacher not found");
  }
});

app.get("/edit-student/:id/students/:studentId", (req, res) => {
  const { id } = req.params;
  const { studentId } = req.params;
  const requiredTeacher = getTeacherById(parseInt(id, 10));
  const requiredStudent = getStudentById(
    parseInt(id, 10),
    parseInt(studentId, 10)
  );
  if (requiredTeacher) {
    res.status(200).render("addStudents.hbs", {
      layout: "navigation",
      title: "Add Student",
      student: requiredStudent,
      action: `/api/teachers/${id}/students/${studentId}`,
      method: "PUT"
    });
  } else {
    res.status(404).send("Teacher not found");
  }
});

app.get("/add-student", (req, res) => {
  res.status(200).render("addStudents", {
    layout: "navigation",
    title: "Add Student",
    action: "/api/teachers",
    method: "POST"
  });
});

app.use("/api/teachers", teachersRouter);

app.get("/about", (req, res) => {
  res.status(200).send("Welcome Home");
});

app.get("*", (req, res) => {
  res.status(404).send("404 Page Not Found");
});

app.listen(8080, () => {
  console.log("server running");
});
