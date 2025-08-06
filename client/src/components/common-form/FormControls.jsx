import { Label } from "@radix-ui/react-label";
import React from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const FormControls = ({ formControls, formData, setFormData }) => {
  const renderComponentByType = (formControl) => {
    let element;
    const currentElementValue = formData[formControl.name] || "";
    switch (formControl.componentType) {
      case "input":
        element = (
          <Input
            id={formControl.name}
            name={formControl.name}
            type={formControl.type}
            placeholder={formControl.placeholder}
            value={currentElementValue}
            onChange={(event) => {
              setFormData({
                ...formData,
                [formControl.name]: event.target.value,
              });
            }}
            className={"placeholder:capitalize focus:border-none"}
          />
        );
        break;
      case "select":
        element = (
          <select
            name={formControl.name}
            onChange={(event) => {
              setFormData({
                ...formData,
                [formControl.name]: event.target.value,
              });
            }}
            value={currentElementValue}
            className="w-full  py-2 px-1 border rounded-[10px]"
          >
            {formControl.options &&
              formControl.options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
          </select>
        );
        break;
      case "textarea":
        element = (
          <Textarea
            id={formControl.name}
            name={formControl.name}
            placeholder={formControl.placeholder}
            value={currentElementValue}
            onChange={(event) =>
              setFormData({
                ...formData,
                [formControl.name]: event.target.value,
              })
            }
          />
        );
        break;

      default:
        element = (
          <Input
            id={formControl.name}
            name={formControl.name}
            type={formControl.type}
            placeholder={formControl.placeholder}
          />
        );
        break;
    }
    return element;
  };
  return (
    <div className="flex flex-col space-y-2">
      {formControls.map((formControl) => (
        <div key={formControl.name}>
          <Label htmlFor={formControl.name} className="block mb-2 capitalize">
            {formControl.label} :
          </Label>
          {renderComponentByType(formControl)}
        </div>
      ))}
    </div>
  );
};

export default FormControls;
