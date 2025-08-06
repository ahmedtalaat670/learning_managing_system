import { getStudentBoughtCoursesService } from "@/services";
import React, { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../auth-context";
export const StudentContext = createContext();
const StudentContextProvider = ({ children }) => {
  const [coursesList, setCoursesList] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [boughtCourses, setBoughtCourses] = useState(null);
  const { authInformation } = useContext(AuthContext);
  const [filters, setFilters] = useState(
    JSON.parse(sessionStorage.getItem("filters")) || {}
  );
  const [loadingState, setLoadingState] = useState(false);
  const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] =
    useState(null);
  const getStudentBoughtCourses = async () => {
    if (
      !authInformation.authentication ||
      authInformation.user?.role === "instructor"
    ) {
      setBoughtCourses(null);
      return;
    }

    const formData = {
      userId: authInformation?.user?._id,
    };
    const response = await getStudentBoughtCoursesService(formData).catch((e) =>
      console.log(e)
    );
    if (response) {
      setBoughtCourses(response.data.courses);
    }
  };
  const checkIfTheCourseBought = (courseId) => {
    if (boughtCourses) {
      const boughtCourse = boughtCourses?.filter(
        (course) => course?.courseId === courseId
      );
      return boughtCourse;
    }
  };
  useEffect(() => {
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
    return () => {
      window.removeEventListener("resize", () =>
        setWindowWidth(window.innerWidth)
      );
    };
  });

  useEffect(() => {
    if (
      !location.href.includes("?") ||
      !location.pathname.includes("courses")
    ) {
      sessionStorage.removeItem("filters");
      setFilters({});
    }
  }, [location.href]);
  useEffect(() => {
    getStudentBoughtCourses();
  }, [authInformation.authentication]);

  return (
    <StudentContext.Provider
      value={{
        coursesList,
        setCoursesList,
        windowWidth,
        filters,
        setFilters,
        loadingState,
        setLoadingState,
        boughtCourses,
        checkIfTheCourseBought,
        studentCurrentCourseProgress,
        setStudentCurrentCourseProgress,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export default StudentContextProvider;
