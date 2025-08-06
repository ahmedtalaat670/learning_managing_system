import StudentViewHeader from "@/components/student-view/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { Watch } from "lucide-react";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StudentCourses = () => {
  const { boughtCourses } = useContext(StudentContext);
  const navigate = useNavigate();
  const { authInformation } = useContext(AuthContext);
  useEffect(() => {
    console.log(authInformation);
  }, []);

  return (
    <div>
      <StudentViewHeader />
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-8">My Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {boughtCourses && boughtCourses.length > 0 ? (
            boughtCourses.map((course) => (
              <Card key={course.courseId} className="flex flex-col">
                <CardContent className="p-4 flex-grow">
                  <img
                    src={course?.courseImage}
                    alt={course?.title}
                    className="h-52 w-full object-cover rounded-md mb-4"
                  />
                  <h3 className="font-bold mb-1 capitalize">{course?.title}</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    {course?.instructorName}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="flex-1 cursor-pointer"
                    onClick={() =>
                      navigate(`/courses/course-progress/${course.courseId}`)
                    }
                  >
                    <Watch className="mr-2 h-4 w-4" />
                    Start Watching
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <h1 className="text-3xl font-bold">No Courses found</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCourses;
