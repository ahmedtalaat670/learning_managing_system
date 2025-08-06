import {
  courseLandingInitialFormData,
  curriculumInitialFormData,
} from "@/config";
import { getInstructorCoursesService } from "@/services";
import React, { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import { AuthContext } from "../auth-context";

export const InstructorContext = createContext(null);

const InstructorProvider = ({ children }) => {
  const [landingFormData, setLandingFormData] = useState(
    courseLandingInitialFormData
  );
  const [curriculumFormData, setCurriculumFormData] = useState([
    ...curriculumInitialFormData,
  ]);
  const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] =
    useState(0);
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const { authInformation } = useContext(AuthContext);
  const getInstructorCourses = async () => {
    setLoading(true);
    const newFormData = {
      instructorId: authInformation.user?._id,
    };
    const response = await getInstructorCoursesService(newFormData).catch((e) =>
      console.log(e)
    );
    if (response.success) {
      setInstructorCourses(response.data);
    }
    setLoading(false);
    console.log(response);
  };
  useEffect(() => {
    if (
      authInformation.authentication &&
      authInformation.user?.role === "instructor"
    )
      getInstructorCourses();
  }, []);
  return (
    <InstructorContext.Provider
      value={{
        landingFormData,
        setLandingFormData,
        curriculumFormData,
        setCurriculumFormData,
        mediaUploadProgress,
        setMediaUploadProgress,
        mediaUploadProgressPercentage,
        setMediaUploadProgressPercentage,
        instructorCourses,
        setInstructorCourses,
        loading,
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
};

export default InstructorProvider;
