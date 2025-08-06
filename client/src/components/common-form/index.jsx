import React from "react";
import FormControls from "./FormControls";
import { Input } from "../ui/input";

const CommonForm = ({
  formControls,
  buttonText,
  formData = [],
  setFormData,
  isButtonDisabled,
  handleSubmit,
}) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FormControls
          formControls={formControls}
          formData={formData}
          setFormData={setFormData}
        />
        <Input
          className={"mt-4 cursor-pointer flex justify-center items-center"}
          type={"submit"}
          value={buttonText || "submit"}
          disabled={isButtonDisabled()}
        />
      </form>
    </div>
  );
};

export default CommonForm;
