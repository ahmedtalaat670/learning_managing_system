import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, logInService, registerService } from "@/services";
import React, { createContext, Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
export const AuthContext = createContext();
const AuthContextProvider = ({ children }) => {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [authInformation, setAuthInformation] = useState({
    authentication: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);
  const handleRegisterUser = async (event) => {
    event.preventDefault();
    setLoading(true);
    const response = await registerService(signUpFormData).catch((error) => {
      toast(error.response.data.message);
    });
    if (response) {
      setSignUpFormData(initialSignUpFormData);
      toast("You created an account successfully");
    }
    setLoading(false);
    console.log(response);
  };
  const handleLoginUser = async (event) => {
    event.preventDefault();
    setLoading(true);
    const response = await logInService(signInFormData).catch((error) => {
      toast(error.response.data.message);
    });
    if (response) {
      sessionStorage.setItem(
        "accessToken",
        JSON.stringify(response.data.accessToken)
      );
      setAuthInformation({
        authentication: true,
        user: response.data.user,
      });
      setSignInFormData(initialSignInFormData);
      toast(
        `Welcome,${
          response.data.user.role === "instructor" ? " instructor " : " "
        }${response.data.user.userName}`
      );
    }
    setLoading(false);
  };
  const handleCheckAuthUser = async () => {
    setLoading(true);
    try {
      const response = await checkAuthService();
      if (response.success) {
        setAuthInformation({
          authentication: true,
          user: response.data.user,
        });
        setLoading(false);
      } else {
        setAuthInformation({
          authentication: false,
          user: null,
        });
        setLoading(false);
      }
    } catch (error) {
      if (!error?.response?.data?.success) {
        setAuthInformation({
          authentication: false,
          user: null,
        });
        setLoading(false);
      }
    }
  };
  const resetCredentials = () => {
    setAuthInformation({
      authentication: false,
      user: null,
    });
  };
  const handleLogOut = () => {
    resetCredentials();
    sessionStorage.clear();
  };
  useEffect(() => {
    handleCheckAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        authInformation,
        resetCredentials,
        loading,
        handleLogOut,
      }}
    >
      <Fragment>
        <main>{!loading && children}</main>
        <Toaster />
      </Fragment>
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
