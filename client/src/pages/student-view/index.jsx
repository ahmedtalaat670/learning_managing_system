import StudentViewHeader from "@/components/student-view/Header";
import React, { useEffect } from "react";
import banner from "../../assets/banner-img.png";
import { courseCategories } from "@/config";
import { Button } from "@/components/ui/button";
import { getStudentViewCourseService } from "@/services";
import { toast } from "sonner";
import { useContext } from "react";
import { StudentContext } from "@/context/student-context";
const StudentViewHomePage = () => {
  const { coursesList, setCoursesList, checkIfTheCourseBought } =
    useContext(StudentContext);
  const getAllCourses = async () => {
    const response = await getStudentViewCourseService().catch((e) =>
      toast(e.response.data.message)
    );
    if (response) {
      setCoursesList(response.data);
    }
  };
  useEffect(() => {
    getAllCourses();
  }, []);
  return (
    <div>
      <StudentViewHeader />
      <section className="flex flex-col lg:flex-row justify-between items-center px-4 py-5 md:px-8 md:py-10 gap-5">
        <div>
          <h3 className="text-2xl md:text-4xl font-bold mb-2">
            Learning that gets you
          </h3>
          <p className="text-[17px] text-gray-700">
            skills for your present and your future. Get Started with us
          </p>
        </div>
        <img src={banner} className="w-[350px] sm:w-[600px] md:w-[700px]" />
      </section>
      <section className="py-8 px-4 lg:px-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {courseCategories.map((categoryItem) => (
            <Button
              className="justify-start"
              variant="outline"
              key={categoryItem.id}
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>
      <section className="py-12 px-4 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coursesList && coursesList.length > 0 ? (
            coursesList.map((courseItem) => (
              <div
                key={courseItem?.title}
                className="border rounded-lg overflow-hidden shadow"
              >
                <img
                  src={courseItem?.image}
                  width={300}
                  height={150}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold mb-2 capitalize">
                    {courseItem?.title}
                  </h3>
                  <p className="text-sm text-gray-700 mb-2">
                    {courseItem?.instructorName}
                  </p>
                  <p className="font-bold text-[16px]">
                    ${courseItem?.pricing}
                  </p>
                  {checkIfTheCourseBought(courseItem._id)?.length ? (
                    <p className="capitalize font-bold text-red-800">
                      *already bought
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ))
          ) : (
            <h1>No Courses Found</h1>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentViewHomePage;
