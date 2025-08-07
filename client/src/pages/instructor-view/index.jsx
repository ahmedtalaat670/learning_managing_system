import InstructorComponent from "@/components/instructor/Dashboard";
import InstructorCourses from "@/components/instructor/Courses";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { Tabs, TabsContent } from "@radix-ui/react-tabs";
import { BarChart, Book, LogOut, SlidersHorizontal } from "lucide-react";
import React, { useContext, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const InstructorViewHomePage = () => {
  const [activeButton, setActiveButton] = useState("dashboard");
  const { handleLogOut, windowWidth } = useContext(AuthContext);

  const menuList = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorComponent />,
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: <InstructorCourses />,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 hidden md:block shadow-md">
        <div className="p-2">
          <h2 className="text-2xl font-bold ">Instructor View</h2>
          <nav className="flex flex-col space-y-4 mt-5">
            {menuList.map((menuItem) => (
              <Button
                key={menuItem.value}
                variant={menuItem.value === activeButton ? "" : "secondary"}
                className={"cursor-pointer"}
                onClick={
                  menuItem.value === "logout"
                    ? () => handleLogOut()
                    : () => setActiveButton(menuItem.value)
                }
              >
                <menuItem.icon />
                {menuItem.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            {windowWidth < 992 && (
              <Sheet>
                <SheetTrigger className={"mb-5"}>
                  <SlidersHorizontal />
                </SheetTrigger>
                <SheetContent className={"flex items-center"}>
                  <aside className="w-64 shadow-md">
                    <div className="p-2">
                      <h2 className="text-2xl font-bold ">Instructor View</h2>
                      <nav className="flex flex-col space-y-4 mt-5">
                        {menuList.map((menuItem) => (
                          <Button
                            key={menuItem.value}
                            variant={
                              menuItem.value === activeButton ? "" : "secondary"
                            }
                            className={"cursor-pointer"}
                            onClick={
                              menuItem.value === "logout"
                                ? () => handleLogOut()
                                : () => setActiveButton(menuItem.value)
                            }
                          >
                            <menuItem.icon />
                            {menuItem.label}
                          </Button>
                        ))}
                      </nav>
                    </div>
                  </aside>
                </SheetContent>
              </Sheet>
            )}
          </div>
          <Tabs value={activeButton} onValueChange={setActiveButton}>
            {menuList.map((menuItem) => (
              <TabsContent value={menuItem.value}>
                {menuItem.component !== null ? menuItem.component : null}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default InstructorViewHomePage;
