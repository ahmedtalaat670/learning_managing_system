import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import MediaProgressbar from "@/components/upload-progress-bar";
import { InstructorContext } from "@/context/instructor-context";
import { deleteImageService, uploadMedia } from "@/services";
import React, { useContext } from "react";

const CourseSettings = () => {
  const {
    landingFormData,
    setLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);
  const handleImageInput = async (e) => {
    const image = e.target.files[0];
    if (image) {
      const imageForm = new FormData();
      imageForm.append("file", image);
      try {
        setMediaUploadProgress(true);
        const { data, success } = await uploadMedia(
          imageForm,
          setMediaUploadProgressPercentage
        );
        if (success) {
          setLandingFormData({
            ...landingFormData,
            image: data.url,
            image_id: data.public_id,
          });
        }
        setMediaUploadProgress(false);
        console.log(landingFormData);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleReplaceTheImage = async () => {
    const { success } = await deleteImageService(landingFormData.image_id);
    if (success) {
      setLandingFormData({
        ...landingFormData,
        image: "",
        image_id: "",
      });
    }
  };
  return (
    <Card>
      {mediaUploadProgress ? (
        <MediaProgressbar
          isMediaUploading={mediaUploadProgress}
          progress={mediaUploadProgressPercentage}
        />
      ) : null}
      <CardHeader>Course Settings</CardHeader>
      <CardContent>
        {landingFormData.image ? (
          <div className="flex flex-col items-center gap-5">
            <Button
              onClick={handleReplaceTheImage}
              className={"cursor-pointer"}
            >
              Replace The Image
            </Button>
            <img src={landingFormData.image} className="w-full " />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <label htmlFor="uploadImage">Upload course image :</label>
            <input
              id="uploadImage"
              type="file"
              accept="image/*"
              className=" border py-2 px-1 rounded-[10px]"
              onChange={handleImageInput}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseSettings;
