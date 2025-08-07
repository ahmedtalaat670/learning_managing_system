import StudentViewHeader from "@/components/student-view/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  createPaymentService,
  getStudentBoughtCoursesService,
  getStudentViewCourseDetailsByIdService,
} from "@/services";
import {
  CheckCircle,
  Globe,
  LoaderCircle,
  Lock,
  PlayCircle,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseDetails = () => {
  const params = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState("");
  const [isBought, setIsBought] = useState(false);
  const [buyNowButtonLoading, setBuyNowButtonLoading] = useState(false);
  const {
    loadingState,
    setLoadingState,
    boughtCourses,
    checkIfTheCourseBought,
  } = useContext(StudentContext);
  const { authInformation } = useContext(AuthContext);
  const fetchCourseDetailsById = async () => {
    setLoadingState(true);
    const response = await getStudentViewCourseDetailsByIdService(params.id);
    if (response) {
      setCourseDetails(response.data);
      console.log(response.data);
    }
    setLoadingState(false);
  };
  function handleSetFreePreview(getCurrentVideoInfo) {
    console.log(getCurrentVideoInfo);
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  }
  const getIndexOfFreePreviewUrl =
    courseDetails !== null
      ? courseDetails?.lectures?.findIndex((item) => item.freePreview)
      : -1;
  async function handleCreatePayment() {
    const paymentPayload = {
      userId: authInformation?.user?._id,
      userName: authInformation?.user?.userName,
      userEmail: authInformation?.user?.userEmail,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: courseDetails?.instructorId,
      instructorName: courseDetails?.instructorName,
      courseImage: courseDetails?.image,
      courseTitle: courseDetails?.title,
      courseId: courseDetails?._id,
      coursePricing: courseDetails?.pricing,
    };

    if (!authInformation.user) {
      return toast("you need to login first");
    }
    setBuyNowButtonLoading(true);
    const response = await createPaymentService(paymentPayload);

    if (response.success) {
      sessionStorage.setItem(
        "currentOrderId",
        JSON.stringify(response?.data?.orderId)
      );
      setApprovalUrl(response?.data?.approveUrl);
    }
  }
  useEffect(() => {
    fetchCourseDetailsById();
  }, []);
  useEffect(() => {
    if (authInformation.authentication) {
      if (checkIfTheCourseBought(courseDetails?._id)?.length) {
        setIsBought(true);
      } else {
        setIsBought(false);
      }
    } else {
      setIsBought(false);
    }
  }, [courseDetails, authInformation.authentication]);
  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);
  if (approvalUrl !== "") {
    window.location.href = approvalUrl;
  }

  return (
    <div>
      {loadingState && (
        <div className="w-full h-screen flex items-center justify-center bg-[rgb(240,240,240,0.5)] z-10 absolute top-0 left-0">
          <LoaderCircle className="animate-spin h-15 w-15" />
        </div>
      )}
      <div className="mx-auto p-4">
        <StudentViewHeader />
        <div className="bg-gray-900 text-white p-8 rounded-t-lg mt-5">
          <h1 className="text-3xl font-bold mb-4 capitalize">
            {courseDetails?.title}
          </h1>
          <p className="text-xl mb-4">{courseDetails?.subtitle}</p>
          <div className="flex items-center space-x-4 mt-2 text-sm">
            <span>Created By {courseDetails?.instructorName}</span>
            <span>Created On {courseDetails?.date.split("T")[0]}</span>
            <span className="flex items-center">
              <Globe className="mr-1 h-4 w-4" />
              {courseDetails?.primaryLanguage}
            </span>
            <span>
              {courseDetails?.students?.length}{" "}
              {courseDetails?.students?.length <= 1 ? "Student" : "Students"}
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8 mt-8">
          <main className="flex-grow">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>What you'll learn</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {courseDetails?.objectives
                    .split(",")
                    .map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{objective}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Course Description</CardTitle>
              </CardHeader>
              <CardContent>{courseDetails?.description}</CardContent>
            </Card>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Course Curriculum</CardTitle>
              </CardHeader>
              <CardContent>
                {courseDetails?.lectures?.map((curriculumItem, index) => (
                  <li
                    className={`flex gap-1 items-center ${
                      curriculumItem.freePreview
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                    }`}
                    onClick={
                      curriculumItem?.freePreview
                        ? () => handleSetFreePreview(curriculumItem)
                        : null
                    }
                  >
                    {curriculumItem?.freePreview ? (
                      <PlayCircle className="mr-2 h-4 w-4" />
                    ) : (
                      <Lock className="mr-2 h-4 w-4" />
                    )}
                    <span>{curriculumItem?.title}</span>
                  </li>
                ))}
              </CardContent>
            </Card>
          </main>
          <aside className="w-full md:w-[500px]">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                  <ReactPlayer
                    url={
                      getIndexOfFreePreviewUrl !== -1
                        ? courseDetails?.lectures[getIndexOfFreePreviewUrl]
                            .videoUrl
                        : ""
                    }
                    width="450px"
                    height="200px"
                    controls
                  />
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold">
                    ${courseDetails?.pricing}
                  </span>
                </div>
                <Button
                  onClick={handleCreatePayment}
                  className="w-full cursor-pointer"
                  disabled={buyNowButtonLoading || isBought}
                >
                  {buyNowButtonLoading ? (
                    <span className="animate-spin">
                      <LoaderCircle />
                    </span>
                  ) : (
                    ""
                  )}{" "}
                  {isBought ? "Already bought" : "Buy Now"}
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
        <Dialog
          open={showFreePreviewDialog}
          onOpenChange={() => {
            setShowFreePreviewDialog(false);
            setDisplayCurrentVideoFreePreview(null);
          }}
        >
          <DialogContent className="w-[800px]">
            <DialogHeader>
              <DialogTitle>Course Preview</DialogTitle>
            </DialogHeader>
            <div className="aspect-video rounded-lg flex items-center justify-center">
              <ReactPlayer
                url={displayCurrentVideoFreePreview}
                width="450px"
                height="200px"
                controls
              />
            </div>
            <div className="flex flex-col gap-2">
              {courseDetails?.lectures
                ?.filter((item) => item.freePreview)
                .map((filteredItem) => (
                  <p
                    onClick={() => handleSetFreePreview(filteredItem)}
                    className="cursor-pointer text-[16px] font-medium"
                  >
                    {filteredItem?.title}
                  </p>
                ))}
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button
                  className={"cursor-pointer"}
                  type="button"
                  variant="secondary"
                >
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CourseDetails;
