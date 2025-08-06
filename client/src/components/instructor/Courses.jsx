import React, { useContext, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Delete, Edit, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AddCourseService,
  deleteCourseByIdService,
  getInstructorCoursesService,
} from "@/services";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import {
  courseLandingInitialFormData,
  curriculumInitialFormData,
} from "@/config";
import { toast } from "sonner";

const InstructorCourses = () => {
  const navigate = useNavigate();
  const { instructorCourses, setInstructorCourses, loading } =
    useContext(InstructorContext);
  const { setLandingFormData, setCurriculumFormData } =
    useContext(InstructorContext);
  const handleUndoButton = async (formData) => {
    const response = await AddCourseService(formData).catch((error) =>
      toast(error.response.data.message)
    );
    if (response) {
      console.log(response.data);
      let cpyInstructorCourses = [...instructorCourses];
      setInstructorCourses(cpyInstructorCourses);
    }
    console.log(instructorCourses);
  };

  const handleDelteCourse = async (index) => {
    const response = await deleteCourseByIdService(
      instructorCourses[index]._id
    ).catch((error) => toast(error.response.data.message));
    if (response.success) {
      toast(
        `You deleted the ${instructorCourses[index].title} course successfully`,
        {
          action: {
            label: "Undo",
            onClick: () => handleUndoButton(response.data),
          },
        }
      );
      const cpyInstructorCourses = [...instructorCourses];
      cpyInstructorCourses.splice(index, 1);
      setInstructorCourses(cpyInstructorCourses);
    }
  };

  return (
    <Card>
      <CardHeader className={"flex justify-between items-center"}>
        <CardTitle className={"text-3xl font-bold capitalize"}>
          All courses
        </CardTitle>
        <Button
          onClick={() => {
            setLandingFormData(courseLandingInitialFormData);
            setCurriculumFormData(curriculumInitialFormData);
            navigate("/instructor/add-new-course");
          }}
          className={"cursor-pointer capitalize"}
        >
          Add new course
        </Button>
      </CardHeader>
      <CardContent>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Courses</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <LoaderCircle className="animate-spin" />
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              )}
              {!loading &&
                instructorCourses[0] &&
                instructorCourses.map((course, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium capitalize">
                      {course.title}
                    </TableCell>
                    <TableCell className={"pl-4"}>
                      {course.students.length}
                    </TableCell>
                    <TableCell>{course.pricing}</TableCell>
                    <TableCell>
                      {course.students.length * course.pricing}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        className={"h-6 w-6 cursor-pointer mr-2"}
                        variant={"ghost"}
                        size={"sm"}
                        onClick={() => {
                          navigate(`/instructor/edit-course/${course._id}`);
                        }}
                      >
                        <Edit className="h-10 w-10" />
                      </Button>
                      <Button
                        className={"h-6 w-6 cursor-pointer"}
                        variant={"ghost"}
                        size={"sm"}
                        onClick={() => handleDelteCourse(index)}
                      >
                        <Delete className="h-10 w-10" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructorCourses;
