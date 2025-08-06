import { InstructorContext } from "@/context/instructor-context";
import React, { useContext, useEffect } from "react";

const NewUploadProgessBar = () => {
  const { mediaUploadProgressPercentage } = useContext(InstructorContext);
  useEffect(() => {
    console.log(mediaUploadProgressPercentage);
  }, [mediaUploadProgressPercentage]);
  return (
    <div className="h-10 w-full border rounded-full">
      <span
        className={`h-full w-[${mediaUploadProgressPercentage}%] bg-blue-500`}
      ></span>
    </div>
  );
};

export default NewUploadProgessBar;
