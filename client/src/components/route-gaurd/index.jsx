import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Fragment, useContext, useEffect } from "react";
import { AuthContext } from "@/context/auth-context";
import { Skeleton } from "../ui/skeleton";

function RouteGuard({ element }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { authInformation, loading } = useContext(AuthContext);

  useEffect(() => {
    if (
      !authInformation.authentication &&
      location.pathname.includes("instructor") &&
      !loading
    ) {
      navigate("/auth");
    }
    if (
      authInformation.authentication &&
      authInformation.user?.role !== "instructor" &&
      (location.pathname.includes("instructor") ||
        location.pathname.includes("auth"))
    ) {
      navigate("/", { replace: true });
    } else if (
      authInformation.authentication &&
      authInformation.user?.role === "instructor" &&
      !location.pathname.includes("instructor")
    ) {
      navigate("/instructor", { replace: true });
    }
  });

  return <Fragment>{element}</Fragment>;
}

export default RouteGuard;
