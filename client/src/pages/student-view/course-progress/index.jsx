import StudentViewHeader from "@/components/student-view/Header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Play,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";

const CourseProgress = () => {
  const { authInformation } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [lockCourse, setLockCourse] = useState(null);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [played, setPlayed] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchCurrentCourseProgress() {
    setLoading(true);
    const response = await getCourseProgressService(
      authInformation?.user?._id,
      id
    );
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

        if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.lectures[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);

          return;
        }

        if (response?.data?.progress?.length === 0) {
          setCurrentLecture(response?.data?.courseDetails?.lectures[0]);
        } else {
          console.log("logging here");
          const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc;
            },
            -1
          );

          setCurrentLecture(
            response?.data?.courseDetails?.lectures[lastIndexOfViewedAsTrue + 1]
          );
        }
      }
    }
    setLoading(false);
  }
  async function updateCourseProgress() {
    if (played?.playedSeconds === duration) {
      if (currentLecture) {
        const formData = {
          userId: authInformation.user?._id,
          courseId: studentCurrentCourseProgress?.courseDetails?._id,
          lectureId: currentLecture._id,
        };
        const response = await markLectureAsViewedService(formData);

        if (response?.success) {
          fetchCurrentCourseProgress();
        }
      }
    }
  }
  async function handleRewatchCourse() {
    const formData = {
      userId: authInformation?.user?._id,
      courseId: studentCurrentCourseProgress?.courseDetails?._id,
    };
    const response = await resetCourseProgressService(formData);

    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  }
  useEffect(() => {
    fetchCurrentCourseProgress();
  }, []);
  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress();
  }, [currentLecture]);
  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
  }, [showConfetti]);

  useEffect(() => {
    updateCourseProgress();
  }, [played?.playedSeconds]);
  return (
    <>
      {loading && (
        <div className="h-screen w-full flex justify-center items-center z-10 absolute top-0 left-0 bg-[rgb(240,240,240,0.5)]">
          <LoaderCircle className="h-20 w-20 animate-spin" />
        </div>
      )}
      <StudentViewHeader />
      <div
        className="flex flex-col bg-[#1c1d1f] text-white"
        style={{ height: "calc(100vh - 68px)" }}
      >
        {showConfetti && <ReactConfetti />}
        <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate("/courses/student-courses")}
              className="text-black cursor-pointer"
              variant="ghost"
              size="sm"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to My Courses Page
            </Button>
            <h1 className="text-lg font-bold hidden md:block capitalize">
              {studentCurrentCourseProgress?.courseDetails?.title}
            </h1>
          </div>
          <Button
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
            className={"cursor-pointer"}
          >
            {isSideBarOpen ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div
            className={`flex-1 ${
              isSideBarOpen ? "mr-[400px]" : ""
            } transition-all duration-300`}
          >
            <ReactPlayer
              width="100%"
              height="500px"
              url={currentLecture?.videoUrl}
              onProgress={(played) => setPlayed(played)}
              onDuration={(duration) => {
                setDuration(duration);
              }}
              controls
            />
            <div className="p-6 bg-[#1c1d1f]">
              <h2 className="text-2xl font-bold mb-2">
                {currentLecture?.title}
              </h2>
            </div>
          </div>
          <div
            className={`fixed top-[135px] right-0 bottom-0 w-[400px] bg-[#1c1d1f] border-l border-gray-700 transition-all duration-300 ${
              isSideBarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <Tabs defaultValue="content" className="h-full flex flex-col">
              <TabsList className="grid bg-[#1c1d1f] w-full grid-cols-2 p-0 h-14">
                <TabsTrigger
                  value="content"
                  className=" text-black h-full cursor-pointer rounded-4xl"
                >
                  Course Content
                </TabsTrigger>
                <TabsTrigger
                  value="overview"
                  className=" text-black  h-full cursor-pointer rounded-4xl"
                >
                  Overview
                </TabsTrigger>
              </TabsList>
              <TabsContent value="content">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    {studentCurrentCourseProgress?.courseDetails?.lectures.map(
                      (item) => (
                        <div
                          className="flex items-center space-x-2 text-sm text-white font-bold cursor-pointer"
                          key={item._id}
                        >
                          {studentCurrentCourseProgress?.progress?.find(
                            (progressItem) =>
                              progressItem.lectureId === item._id
                          )?.viewed ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Play className="h-4 w-4 " />
                          )}
                          <span>{item?.title}</span>
                        </div>
                      )
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="overview" className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">
                      About this course
                    </h2>
                    <p className="text-gray-400">
                      {studentCurrentCourseProgress?.courseDetails?.description}
                    </p>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <Dialog open={lockCourse}>
          <DialogContent className="sm:w-[425px]">
            <DialogHeader>
              <DialogTitle>You can't view this page</DialogTitle>
              <DialogDescription>
                Please purchase this course to get access
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog open={showCourseCompleteDialog}>
          <DialogContent showOverlay={false} className="sm:w-[425px]">
            <DialogHeader>
              <DialogTitle>Congratulations!</DialogTitle>
              <DialogDescription className="flex flex-col gap-3">
                <Label>You have completed the course</Label>
                <div className="flex flex-row gap-3">
                  <Button
                    className={"cursor-pointer"}
                    onClick={() => navigate("/courses/student-courses")}
                  >
                    My Courses Page
                  </Button>
                  <Button
                    className={"cursor-pointer"}
                    onClick={handleRewatchCourse}
                  >
                    Rewatch Course
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default CourseProgress;
