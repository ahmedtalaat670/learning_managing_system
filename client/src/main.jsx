import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthContextProvider from "./context/auth-context";
import InstructorProvider from "./context/instructor-context";
import StudentContextProvider from "./context/student-context";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <InstructorProvider>
        <StudentContextProvider>
          <App />
        </StudentContextProvider>
      </InstructorProvider>
    </AuthContextProvider>
  </StrictMode>
);
