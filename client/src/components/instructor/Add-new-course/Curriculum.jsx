import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import MediaProgressbar from "@/components/upload-progress-bar";
import NewUploadProgessBar from "@/components/upload-progress-bar/newUploadProgessBar";
import { curriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  bulkUploadMediaService,
  deleteVideoService,
  uploadMedia,
} from "@/services";
import { LoaderCircle, Upload } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useRef } from "react";
import ReactPlayer from "react-player";

const Curriculum = () => {
  const {
    curriculumFormData,
    setCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);
  const [uploadingVideoIndex, setUploadingVideoIndex] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [theLoadingInput, setTheLoadingInput] = useState("");
  const bulkUploadInputRef = useRef(null);
  const handleCreateNewLecture = () => {
    setCurriculumFormData([
      ...curriculumFormData,
      {
        title: "",
        freePreview: false,
        videoUrl: "",
        public_id: "",
      },
    ]);
    console.log(curriculumFormData);
    console.log(curriculumInitialFormData);
  };
  const handleTitleInput = (e, index) => {
    let cpycurriculumFormData = [...curriculumFormData];
    cpycurriculumFormData[index] = {
      ...cpycurriculumFormData[index],
      title: e.target.value,
    };
    setCurriculumFormData(cpycurriculumFormData);
  };
  const handleSwitchInput = (value, index) => {
    let cpycurriculumFormData = [...curriculumFormData];
    cpycurriculumFormData[index].freePreview = value;
    setCurriculumFormData(cpycurriculumFormData);
  };
  const handleMediaUpload = async (e, index) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const videoForm = new FormData();
      videoForm.append("file", selectedFile);
      try {
        setMediaUploadProgress(true);
        setUploadingVideoIndex([...uploadingVideoIndex, index]);
        const { data, success } = await uploadMedia(
          videoForm,
          setMediaUploadProgressPercentage
        );
        if (success) {
          let cpycurriculumFormData = [...curriculumFormData];
          cpycurriculumFormData[index] = {
            ...cpycurriculumFormData[index],
            videoUrl: data.url,
            public_id: data.public_id,
          };
          setCurriculumFormData(cpycurriculumFormData);
          setMediaUploadProgress(false);
          setUploadingVideoIndex(() => {
            uploadingVideoIndex.splice(index, 1);
            return uploadingVideoIndex;
          });
          setMediaUploadProgressPercentage(0);
        }
        console.log(curriculumFormData);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleReplaceTheVideo = async (index) => {
    setLoading(true);
    setTheLoadingInput("replace");
    const response = await deleteVideoService(
      curriculumFormData[index].public_id
    );
    if (response.success) {
      let cpycurriculumFormData = [...curriculumFormData];
      cpycurriculumFormData[index] = {
        ...cpycurriculumFormData[index],
        videoUrl: "",
        public_id: "",
      };
      setCurriculumFormData(cpycurriculumFormData);
    }
    setLoading(false);
    setTheLoadingInput("");
  };
  const handleBulkUploadButton = () => {
    bulkUploadInputRef.current.click();
  };
  const handleBulkUploadInput = async (e) => {
    const files = e.target.files;
    const newFormData = new FormData();
    const filesArray = [...files];
    filesArray.map((file) => newFormData.append("files", file));
    setIsUploading(true);
    const { success, data } = await bulkUploadMediaService(
      newFormData,
      setMediaUploadProgressPercentage
    );
    if (success) {
      if (curriculumFormData[curriculumFormData.length - 1].videoUrl === "") {
        const cpycurriculumFormData = [...curriculumFormData];
        cpycurriculumFormData[cpycurriculumFormData.length - 1] = {
          ...cpycurriculumFormData[cpycurriculumFormData.length - 1],
          videoUrl: data[0].url,
          public_id: data[0].public_id,
        };
        data.splice(0, 1);
        const newLectures = data.map((dataItem) => ({
          title: "",
          freePreview: false,
          videoUrl: dataItem.url,
          public_id: dataItem.public_id,
        }));
        setCurriculumFormData([...cpycurriculumFormData, ...newLectures]);
      } else if (
        curriculumFormData[curriculumFormData.length - 1].videoUrl !== ""
      ) {
        const newLectures = data.map((dataItem) => ({
          title: "",
          freePreview: false,
          videoUrl: dataItem.url,
          public_id: dataItem.public_id,
        }));
        setCurriculumFormData([...curriculumFormData, ...newLectures]);
      }
    }
    setIsUploading(false);
    setMediaUploadProgressPercentage(0);
  };
  const handleDeleteButton = async (index) => {
    setLoading(true);
    setTheLoadingInput("delete");
    const { success } = await deleteVideoService(
      curriculumFormData[index].public_id
    );
    if (success) {
      const cpycurriculumFormData = [...curriculumFormData];
      cpycurriculumFormData.splice(index, 1);
      setCurriculumFormData(cpycurriculumFormData);
    }
    setLoading(false);
    setTheLoadingInput("");
  };
  useEffect(() => {
    console.log(mediaUploadProgressPercentage);
  }, [mediaUploadProgressPercentage]);
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 md:flex-row md:justify-between">
        <h1 className="text-3xl capitalize">curriculum</h1>
        <Button className={"cursor-pointer"} onClick={handleBulkUploadButton}>
          <Upload /> Bulk-Upload
        </Button>
        <Input
          type={"file"}
          accept={"video/*"}
          className={"hidden"}
          ref={bulkUploadInputRef}
          multiple
          onChange={handleBulkUploadInput}
        />
        <Button
          className={"capitalize text-md cursor-pointer"}
          onClick={handleCreateNewLecture}
        >
          create new lecture
        </Button>
      </CardHeader>
      {isUploading && <Progress value={mediaUploadProgressPercentage} />}
      <CardContent className={"flex flex-col gap-5"}>
        {curriculumFormData.map((lecture, index) => (
          <Card key={`lecture-${index + 1}`} className="flex flex-col gap-5">
            {mediaUploadProgress && uploadingVideoIndex.includes(index) && (
              <Progress value={mediaUploadProgressPercentage} />
            )}
            <CardHeader className="text-xl capitalize">{`lecture ${
              index + 1
            }`}</CardHeader>
            <CardContent className={"flex flex-col gap-5"}>
              <div className="flex flex-col gap-3 md:flex-row md:justify-between">
                <Input
                  name={`lecture-${index + 1}-title`}
                  type="text"
                  placeholder={"the title of the lecture"}
                  className={"w-full md:w-[50%] placeholder:capitalize "}
                  onChange={(e) => handleTitleInput(e, index)}
                  value={curriculumFormData[index].title}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`lecture-${index + 1}-freePreview`}
                    name={`lecture-${index + 1}-freePreview`}
                    onCheckedChange={(value) => handleSwitchInput(value, index)}
                    checked={curriculumFormData[index].freePreview}
                  />
                  <Label
                    htmlFor={`lecture-${index + 1}-freePreview`}
                    className={"capitalize"}
                  >
                    free preview
                  </Label>
                </div>
              </div>
              <div>
                {curriculumFormData[index].videoUrl ? (
                  <div className="flex justify-between gap-4 flex-col md:flex-row md:gap-0">
                    <div className="w-full md:w-[500px] h-[300px] relative">
                      <ReactPlayer
                        url={curriculumFormData[index].videoUrl}
                        width={"100%"}
                        height={"100%"}
                        className={"absolute top-0 left-0"}
                        controls
                      />
                    </div>
                    <div className="flex flex-col gap-5 justify-around">
                      <Button
                        onClick={() => handleReplaceTheVideo(index)}
                        className={"capitalize cursor-pointer"}
                        disabled={loading}
                      >
                        {theLoadingInput === "replace" && (
                          <LoaderCircle className="animate-spin" />
                        )}
                        replace the video
                      </Button>
                      <Button
                        className={
                          "capitalize cursor-pointer bg-red-700 hover:bg-red-900"
                        }
                        onClick={() => handleDeleteButton(index)}
                        disabled={loading}
                      >
                        {theLoadingInput === "delete" && (
                          <LoaderCircle className="animate-spin" />
                        )}
                        delete the lecture
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Input
                    name={`lecture-${index + 1}-videoUrl`}
                    type={"file"}
                    accept={"video/*"}
                    onChange={(e) => handleMediaUpload(e, index)}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default Curriculum;
