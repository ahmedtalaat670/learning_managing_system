import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";
import AuthPage from "./pages/auth";
import RouteGaurd from "./components/route-gaurd";
import InstructorViewHomePage from "./pages/instructor-view";
import StudentViewHomePage from "./pages/student-view";
import AddNewCourse from "./pages/instructor-view/Add-course";
import StudentViewCoursesPage from "./pages/student-view/courses";
import CourseDetails from "./pages/student-view/courseDetails";
import StudentCourses from "./pages/student-view/student-courses";
import CourseProgress from "./pages/student-view/course-progress";
import NotFoundPage from "./pages/not-found";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "",
      element: <RouteGaurd element={<StudentViewHomePage />} />,
    },
    {
      path: "/courses",
      element: <RouteGaurd element={<StudentViewCoursesPage />} />,
    },
    {
      path: "/courses/student-courses",
      element: <RouteGaurd element={<StudentCourses />} />,
    },
    {
      path: "/courses/course-progress/:id",
      element: <RouteGaurd element={<CourseProgress />} />,
    },
    {
      path: "/courses/details/:id",
      element: <RouteGaurd element={<CourseDetails />} />,
    },
    {
      path: "/auth",
      element: <RouteGaurd element={<AuthPage />} />,
    },
    {
      path: "/instructor",
      element: <RouteGaurd element={<InstructorViewHomePage />} />,
    },
    {
      path: "/instructor/add-new-course",
      element: <RouteGaurd element={<AddNewCourse />} />,
    },
    {
      path: "/instructor/edit-course/:courseId",
      element: <RouteGaurd element={<AddNewCourse />} />,
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
