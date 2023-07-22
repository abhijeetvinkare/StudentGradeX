import { Route, Routes } from "react-router-dom";
import AdminLogin from "./Admin/Pages/AdminLogin/AdminHome"
import AdminDashboard from "./Admin/Pages/AdminDashboard/Dashboard";
import CreateClasses from "./Admin/Pages/Classes/CreateClasses";
import ManageClasses from "./Admin/Pages/Classes/ManageClasses";
import CreateSubject from "./Admin/Pages/Subject/CreateSubject";
import ManageSubject from "./Admin/Pages/Subject/ManageSubject";
import AddStudent from "./Admin/Pages/Student/AddStudent";
import ManageStudent from "./Admin/Pages/Student/ManageStudent";
import TeacherLogin from "./Teacher/TeacherLogin/TeacherLogin";
import TeacherDashboard from "./Teacher/TeacherDashboard/TeacherDashboard";
import TeacherChangePass from "./Teacher/TeacherChangePass/TeacherChangePass";
import AddResult from "./Teacher/Result/AddResult";
import ManageResult from "./Teacher/Result/ManageResult";
import AdminChangePass from "./Admin/Pages/AdminChangePassword/AdminChangePass";
import UserHome from "./User/UserHome/UserHome";
import UserResult from "./User/UserResult/UserResult";
import NotFound from "./Admin/Components/ErrorPages/NotFound"
import Error from "./Admin/Components/ErrorPages/Error"

function App() {
  return (
    <div>
      <Routes>
        <Route exact path="/admin" element={<AdminLogin />}></Route>
        <Route exact path="/dashboard" element={<AdminDashboard />}></Route>
        <Route exact path="/addstudent" element={<AddStudent />}></Route>
        <Route exact path="/create-classes" element={<CreateClasses />}></Route>
        <Route exact path="/manage-classes" element={<ManageClasses />}></Route>
        <Route exact path="/create-subject" element={<CreateSubject />}></Route>
        <Route exact path="/manage-subject" element={<ManageSubject />}></Route>
        <Route exact path="/add-student" element={<AddStudent/>}></Route>
        <Route exact path="/manage-student" element={<ManageStudent />}></Route>
        <Route exact path="/admin-change-pass" element={<AdminChangePass  />}></Route>
        <Route exact path="/teacher" element={<TeacherLogin />}></Route>
        <Route exact path="/teacher-dashboard" element={<TeacherDashboard />}></Route>
        <Route exact path="/teacher-change-pass" element={<TeacherChangePass />}></Route>
        <Route exact path="/add-result" element={<AddResult />}></Route>
        <Route exact path="/manage-result" element={<ManageResult />}></Route>
        <Route exact path="/" element={<UserHome />}></Route>
        <Route exact path="/final-result" element={<UserResult />}></Route>
        <Route exact path="/error" element={<Error />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
}

export default App;
