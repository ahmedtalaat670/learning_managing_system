import CourseLandingPage from "@/components/instructor/Add-new-course/CourseLandingPage";
import CourseSettings from "@/components/instructor/Add-new-course/CourseSettings";
import Curriculum from "@/components/instructor/Add-new-course/Curriculum";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TabsTrigger } from "@/components/ui/tabs";
import {
  courseLandingInitialFormData,
  curriculumInitialFormData,
} from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import {
  AddCourseService,
  getCourseDetailsByIdAndUpdateService,
  getCourseDetailsByIdService,
} from "@/services";
import { Tabs, TabsContent, TabsList } from "@radix-ui/react-tabs";
import { LoaderCircle } from "lucide-react";
import React, { Suspense, useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const AddNewCourse = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState("curriculum");
  const [loadingState, setLoadingState] = useState(false);
  const params = useParams();
  const location = useLocation();
  const {
    landingFormData,
    curriculumFormData,
    setLandingFormData,
    setCurriculumFormData,
  } = useContext(InstructorContext);
  const { authInformation } = useContext(AuthContext);
  const handleTabValueChange = (value) => {
    setTabValue(value);
  };
  const isEmpty = (value) => {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return value === "" || value === undefined || value === null;
  };
  const validateSubmitButton = () => {
    for (const key in landingFormData) {
      if (isEmpty(landingFormData[key])) {
        return false;
      }
    }
    let hasFreePreview = false;
    for (const item of curriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        return false;
      }
      if (item.freePreview) {
        hasFreePreview = true;
      }
    }
    return hasFreePreview;
  };
  const handleAddNewCourse = async () => {
    setLoadingState(true);
    const newFormData = {
      instructorId: authInformation.user?._id,
      instructorName: authInformation.user?.userName,
      date: new Date(),
      ...landingFormData,
      students: [],
      lectures: [...curriculumFormData],
      isPublished: true,
    };
    const { success } = await AddCourseService(newFormData);
    if (success) {
      toast("You added new course successfully");
    }
    setLoadingState(false);
    setLandingFormData(courseLandingInitialFormData);
    setCurriculumFormData(curriculumInitialFormData);
    navigate(-1);
  };
  const handleUpdateCourse = async () => {
    const updatedFormData = {
      instructorId: authInformation.user?._id,
      instructorName: authInformation.user?.userName,
      date: landingFormData.date,
      ...landingFormData,
      students: [],
      lectures: [...curriculumFormData],
      isPublished: true,
    };
    setLoadingState(true);
    const { success } = await getCourseDetailsByIdAndUpdateService(
      params?.courseId,
      updatedFormData
    );
    if (success) {
      toast(`You modified the ${landingFormData.title} course`);
      navigate("/instructor");
    }
    setLoadingState(false);
  };
  const fetchCourseDetailsById = async (id) => {
    const { success, data } = await getCourseDetailsByIdService(id);
    if (success) {
      setLandingFormData({
        title: data.title,
        category: data.category,
        level: data.level,
        primaryLanguage: data.primaryLanguage,
        subtitle: data.subtitle,
        description: data.description,
        pricing: data.pricing,
        objectives: data.objectives,
        welcomeMessage: data.welcomeMessage,
        image: data.image,
        image_id: data.image_id,
        date: data.date,
      });
      setCurriculumFormData(data.lectures);
      console.log(data);
    }
  };
  useEffect(() => {
    if (params?.courseId) fetchCourseDetailsById(params?.courseId);
  }, [params?.courseId]);
  console.log(location.pathname.includes("edit-course"));
  return (
    <div className="container mx-auto p-10">
      <div className="flex justify-between items-center mb-10">
        <Link to={"/instructor"} className="text-3xl font-bold capitalize">
          Dashboard
        </Link>
        <Button
          onClick={() => {
            location.pathname.includes("edit-course")
              ? handleUpdateCourse()
              : handleAddNewCourse();
          }}
          disabled={!validateSubmitButton() || loadingState}
          className={"uppercase tracking-wider py-4 px-6 cursor-pointer"}
        >
          {loadingState && <LoaderCircle className="animate-spin" />}
          submit
        </Button>
      </div>
      <Card>
        <CardContent>
          <Tabs
            defaultValue={tabValue}
            onValueChange={handleTabValueChange}
            className="w-full flex flex-col items-center"
          >
            <TabsList className="flex  bg-neutral-200 rounded-xl mb-5 w-full md:w-[600px] ">
              <TabsTrigger
                value="curriculum"
                className={`${
                  tabValue === "curriculum" ? "bg-neutral-50" : ""
                } rounded-xl capitalize cursor-pointer`}
              >
                curriculum
              </TabsTrigger>
              <TabsTrigger
                value="course-landing-page"
                className={`${
                  tabValue === "course-landing-page" ? "bg-neutral-50" : ""
                } rounded-xl capitalize cursor-pointer`}
              >
                landing
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className={`${
                  tabValue === "settings" ? "bg-neutral-50" : ""
                } rounded-xl capitalize cursor-pointer`}
              >
                settings
              </TabsTrigger>
            </TabsList>
            <TabsContent value="curriculum" className="w-full">
              <Curriculum />
            </TabsContent>
            <TabsContent value="course-landing-page" className="w-full">
              <CourseLandingPage />
            </TabsContent>
            <TabsContent value="settings" className="w-full">
              <CourseSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddNewCourse;
