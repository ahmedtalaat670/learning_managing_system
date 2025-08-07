import { CircleUserRound, GraduationCap } from "lucide-react";
import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";

const StudentViewHeader = () => {
  const { authInformation, handleLogOut, windowWidth } =
    useContext(AuthContext);
  const { setFilters } = useContext(StudentContext);
  const navigate = useNavigate();
  const handleSignInButton = () => {
    navigate("/auth");
  };
  const handleSignOutButton = () => {
    navigate("/");
    handleLogOut();
  };
  return (
    <header>
      <div className="flex justify-between items-center px-4 py-2 md:px-8 md:py-4 shadow">
        <div
          className={`flex items-center ${
            windowWidth <= 992 ? "justify-around w-full" : "gap-5"
          }`}
        >
          <Link
            to={"/"}
            className="flex gap-3 capitalize text-xl md:text-2xl font-bold items-center"
          >
            <GraduationCap className="h-4 w-4 md:h-8 md:w-8" />
            lms learning
          </Link>
          <Button
            className={`capitalize cursor-pointer ${
              windowWidth <= 992 ? "hidden" : ""
            }`}
            onClick={() => {
              navigate("/courses");
              sessionStorage.removeItem("filters");
              setFilters({});
            }}
            variant={"ghost"}
          >
            explore courses
          </Button>
          {windowWidth <= 992 ? (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={"cursor-pointer"}>
                    <CircleUserRound />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent
                    className={"flex flex-col gap-2 p-2 w-40 "}
                  >
                    <NavigationMenuLink
                      className={"capitalize text-[12px] w-26 cursor-pointer"}
                      onClick={() => navigate("/courses/student-courses")}
                    >
                      my courses
                    </NavigationMenuLink>

                    <NavigationMenuLink
                      className={"capitalize text-[12px] w-26 cursor-pointer"}
                      onClick={() => navigate("/courses")}
                    >
                      explore courses
                    </NavigationMenuLink>
                    <Button
                      className={"cursor-pointer"}
                      onClick={
                        authInformation.authentication
                          ? handleSignOutButton
                          : handleSignInButton
                      }
                    >
                      {authInformation.authentication ? "Sign out" : "Sign in"}
                    </Button>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          ) : (
            ""
          )}
        </div>
        <div className={`${windowWidth <= 992 ? "hidden" : ""} flex gap-3`}>
          <Button
            onClick={() => navigate("/courses/student-courses")}
            className={"capitalize cursor-pointer"}
            variant={"ghost"}
          >
            my courses
          </Button>
          <Button
            className={"cursor-pointer"}
            onClick={
              authInformation.authentication
                ? handleSignOutButton
                : handleSignInButton
            }
          >
            {authInformation.authentication ? "Sign out" : "Sign in"}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default StudentViewHeader;
