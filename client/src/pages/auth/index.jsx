import CommonForm from "@/components/common-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signinFormControls, signupFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { Value } from "@radix-ui/react-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { GraduationCap } from "lucide-react";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

const AuthPage = () => {
  const [tabValue, setTabValue] = useState("signin");
  const handleTabChange = (value) => {
    setTabValue(value);
  };
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
    loading,
  } = useContext(AuthContext);
  const validateSignInForm = () => {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  };
  const validateSignUpForm = () => {
    return (
      signUpFormData &&
      signUpFormData.username !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
  };
  const handleDisablingTheSignUpButton = () => {
    if (!validateSignUpForm()) {
      return true;
    }
    if (loading) return true;
    return false;
  };
  const handleDisablingTheSignInButton = () => {
    if (!validateSignInForm()) {
      return true;
    }
    if (loading) return true;
    return false;
  };
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center border-b h-14 px-4 lg:px-6">
        <Link to={"/"} className="flex items-center justify-center">
          <GraduationCap className="w-8 h-8" />
        </Link>
      </header>
      <div
        className={`flex items-center justify-center w-full bg-background`}
        style={{ height: "calc(100vh - 56px)" }}
      >
        <Tabs
          defaultValue="signin"
          value={tabValue}
          className="w-full md:w-[500px]"
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-full grid-cols-2 bg-neutral-200 h-12 rounded-2xl  items-center">
            <TabsTrigger
              value="signin"
              className={`${
                tabValue === "signin" ? "bg-neutral-50" : null
              } h-8 ml-2 rounded-2xl cursor-pointer`}
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className={`${
                tabValue === "signup" ? "bg-neutral-50" : null
              } h-8 mr-2 rounded-2xl cursor-pointer`}
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle className={"text-2xl font-bold"}>
                  Sign in to your account
                </CardTitle>
                <CardDescription className={"text-[14px]"}>
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <CommonForm
                    formControls={signinFormControls}
                    buttonText={"Sign In"}
                    formData={signInFormData}
                    setFormData={setSignInFormData}
                    isButtonDisabled={handleDisablingTheSignInButton}
                    handleSubmit={handleLoginUser}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className={"text-2xl font-bold"}>
                  Create a new account
                </CardTitle>
                <CardDescription className={"text-[14px]"}>
                  Enter your details to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <CommonForm
                    formControls={signupFormControls}
                    buttonText={"Sign Up"}
                    formData={signUpFormData}
                    setFormData={setSignUpFormData}
                    isButtonDisabled={handleDisablingTheSignUpButton}
                    handleSubmit={handleRegisterUser}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
