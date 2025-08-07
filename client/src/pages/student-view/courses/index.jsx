import StudentViewHeader from "@/components/student-view/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { StudentContext } from "@/context/student-context";
import { getStudentViewCourseService } from "@/services";
import { DropdownMenuRadioItem } from "@radix-ui/react-dropdown-menu";
import { Label } from "@radix-ui/react-label";
import {
  ArrowUpDownIcon,
  LoaderCircle,
  Settings,
  SlidersHorizontal,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const handleUrlSearchParams = (filters) => {
  const queryParams = [];
  for (const [key, value] of Object.entries(filters)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
};

const StudentViewCoursesPage = () => {
  const [loadingState, setLoadingState] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState("price-lowtohigh");
  const [coursesList, setCoursesList] = useState([]);
  const { windowWidth, filters, setFilters, checkIfTheCourseBought } =
    useContext(StudentContext);
  const navigate = useNavigate();
  const handleFiltersChange = (keyItem, optionId) => {
    let cpyFilters = { ...filters };
    const keyIndex = Object.keys(cpyFilters).indexOf(keyItem);
    if (keyIndex === -1) {
      cpyFilters = {
        ...cpyFilters,
        [keyItem]: [optionId],
      };
    } else {
      const optionIndex = cpyFilters[keyItem].indexOf(optionId);
      if (optionIndex === -1) {
        cpyFilters[keyItem].push(optionId);
      } else {
        cpyFilters[keyItem].splice(optionIndex, 1);
      }
    }
    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  };
  const getCourses = async () => {
    setLoadingState(true);
    const query = new URLSearchParams({ ...filters, sortBy: sort });
    const response = await getStudentViewCourseService(query);
    if (response) {
      setCoursesList(response.data);
    }
    setLoadingState(false);
  };
  useEffect(() => {
    const queryParams = handleUrlSearchParams(filters);
    setSearchParams(new URLSearchParams(queryParams));
  }, [filters]);
  useEffect(() => {
    if (filters !== null && sort !== null) getCourses();
  }, [filters, sort]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  return (
    <div>
      <StudentViewHeader />
      <div className="container mx-auto p-2 md:p-3 lg:p-5">
        <div className="flex justify-between items-center">
          <h1 className="capitalize text-3xl font-bold mb-5">all courses</h1>
          {windowWidth <= 992 ? (
            <Sheet>
              <SheetTrigger className={"cursor-pointer"}>
                <SlidersHorizontal />
              </SheetTrigger>
              <SheetContent>
                <aside className="flex flex-col gap-5 p-5">
                  {Object.keys(filterOptions).map((keyItem) => (
                    <div key={keyItem} className="flex flex-col gap-2">
                      <h2 className="text-xl capitalize font-semibold">
                        {keyItem}
                      </h2>
                      <div className="flex flex-col gap-2">
                        {filterOptions[keyItem].map((option) => (
                          <Label
                            key={option.id}
                            className="flex items-center gap-2 cursor-pointer ml-2"
                          >
                            <Checkbox
                              id={option.id}
                              checked={
                                (filters &&
                                  Object.keys(filters).length > 0 &&
                                  filters[keyItem] &&
                                  filters[keyItem].indexOf(option.id) > -1) ||
                                false
                              }
                              onCheckedChange={() => {
                                handleFiltersChange(keyItem, option.id);
                              }}
                            />
                            {option.label}
                          </Label>
                        ))}
                      </div>
                    </div>
                  ))}
                </aside>
              </SheetContent>
            </Sheet>
          ) : (
            ""
          )}
        </div>
        <div className="flex gap-20 p-2 md:p-3 lg:p-5">
          <aside
            className={`${
              windowWidth <= 992 ? "hidden" : ""
            } flex flex-col gap-5 `}
          >
            {Object.keys(filterOptions).map((keyItem) => (
              <div key={keyItem} className="flex flex-col gap-2">
                <h2 className="text-xl capitalize font-semibold">{keyItem}</h2>
                <div className="flex flex-col gap-2">
                  {filterOptions[keyItem].map((option) => (
                    <Label
                      key={option.id}
                      className="flex items-center gap-2 cursor-pointer ml-2"
                    >
                      <Checkbox
                        id={option.id}
                        checked={
                          (filters &&
                            Object.keys(filters).length > 0 &&
                            filters[keyItem] &&
                            filters[keyItem].indexOf(option.id) > -1) ||
                          false
                        }
                        onCheckedChange={() => {
                          handleFiltersChange(keyItem, option.id);
                        }}
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              </div>
            ))}
          </aside>
          <div className="w-[1000px] flex flex-col items-end gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"outline"}
                  className={"cursor-pointer capitalize"}
                >
                  <ArrowUpDownIcon />
                  sort by
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={"w-45 p-2"} align={"end"}>
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => {
                    setSort(value);
                  }}
                  className={"flex flex-col gap-2"}
                >
                  {sortOptions.map((option) => (
                    <DropdownMenuRadioItem
                      key={option.id}
                      value={option.id}
                      className="cursor-pointer p-2"
                    >
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="space-y-4 w-full">
              {loadingState && (
                <div className="w-full flex justify-center items-center">
                  <LoaderCircle className="animate-spin h-10 w-10" />
                </div>
              )}
              {coursesList && coursesList.length > 0 ? (
                coursesList.map((courseItem) => (
                  <Card
                    className="cursor-pointer "
                    key={courseItem?._id}
                    onClick={() => {
                      navigate(`/courses/details/${courseItem._id}`);
                    }}
                  >
                    <CardContent className="flex flex-col">
                      <div className="flex flex-col md:flex-row gap-4 p-4">
                        <div className="w-full md:w-48 md:h-32 flex-shrink-0">
                          <img
                            src={courseItem?.image}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2 capitalize">
                            {courseItem?.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mb-1">
                            Created By{" "}
                            <span className="font-bold">
                              {courseItem?.instructorName}
                            </span>
                          </p>
                          <p className="text-[16px] text-gray-600 mt-3 mb-2">
                            {`${courseItem?.lectures?.length} ${
                              courseItem?.lectures?.length <= 1
                                ? "Lecture"
                                : "Lectures"
                            } - ${courseItem?.level.toUpperCase()} Level`}
                          </p>
                          <p className="font-bold text-lg">
                            ${courseItem?.pricing}
                          </p>
                        </div>
                      </div>
                      {checkIfTheCourseBought(courseItem._id)?.length ? (
                        <div className="p-4 font-bold text-xl text-red-800">
                          * you already bought this course
                        </div>
                      ) : (
                        ""
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : loadingState ? (
                <Skeleton />
              ) : (
                <h1 className="font-extrabold text-4xl">No Courses Found</h1>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentViewCoursesPage;
