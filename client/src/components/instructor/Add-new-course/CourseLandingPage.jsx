import FormControls from "@/components/common-form/FormControls";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { courseLandingPageFormControls } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import React from "react";
import { useContext } from "react";

const CourseLandingPage = () => {
  const { landingFormData, setLandingFormData } = useContext(InstructorContext);

  return (
    <Card>
      <CardHeader>course landing page</CardHeader>
      <CardContent>
        <FormControls
          formControls={courseLandingPageFormControls}
          formData={landingFormData}
          setFormData={setLandingFormData}
        />
      </CardContent>
    </Card>
  );
};

export default CourseLandingPage;
