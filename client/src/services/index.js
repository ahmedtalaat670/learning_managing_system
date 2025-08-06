import axiosInstance from "@/api/axiosInstace";

export const registerService = async (formData) => {
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
    role: "user",
  });

  return data;
};
export const logInService = async (formData) => {
  const { data } = await axiosInstance.post("/auth/login", formData);
  return data;
};
export const checkAuthService = async () => {
  const { data } = await axiosInstance.get("/auth/checkAuth");
  return data;
};
export const uploadMedia = async (formData, onProgressCallback) => {
  const { data } = await axiosInstance.post("/media/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const completedPercent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(completedPercent);
    },
  });
  return data;
};
export const bulkUploadMediaService = async (formData, onProgressCallback) => {
  const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
    onUploadProgress: (progressEvent) => {
      const completedPercent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(completedPercent);
    },
  });
  return data;
};
export const deleteVideoService = async (id) => {
  const { data } = await axiosInstance.delete(`/media/delete/${id}`);
  return data;
};

export const deleteImageService = async (id) => {
  const { data } = await axiosInstance.delete(`/media/image/delete/${id}`);
  return data;
};

export const getInstructorCoursesService = async (formData) => {
  const { data } = await axiosInstance.post(`/instructor/get`, formData);
  return data;
};

export const AddCourseService = async (formData) => {
  const { data } = await axiosInstance.post("/instructor/add", formData);
  return data;
};
export const getCourseDetailsByIdService = async (id) => {
  const { data } = await axiosInstance.get(`/instructor/course/get/${id}`);
  return data;
};
export const getCourseDetailsByIdAndUpdateService = async (id, formData) => {
  const { data } = await axiosInstance.put(
    `/instructor/update/${id}`,
    formData
  );
  return data;
};
export const deleteCourseByIdService = async (id) => {
  const { data } = await axiosInstance.delete(`/instructor/delete/${id}`);
  return data;
};
export const getStudentViewCourseService = async (query) => {
  const { data } = await axiosInstance.get(`/student/allCourses?${query}`);
  return data;
};
export const getStudentViewCourseDetailsByIdService = async (id) => {
  const { data } = await axiosInstance.get(`/student/course/${id}`);
  return data;
};
export async function createPaymentService(formData) {
  const { data } = await axiosInstance.post(`/student/order/create`, formData);

  return data;
}
export async function captureAndFinalizePaymentService(
  paymentId,
  payerId,
  orderId
) {
  const { data } = await axiosInstance.post(`/student/order/capture`, {
    paymentId,
    payerId,
    orderId,
  });

  return data;
}
export const getStudentBoughtCoursesService = async (formData) => {
  const { data } = await axiosInstance.post(
    "/student/bought-courses",
    formData
  );
  return data;
};
export const getCourseProgressService = async (userId, courseId) => {
  const { data } = await axiosInstance.get(
    `/student/course-progress/get/${userId}/${courseId}`
  );
  return data;
};
export const markLectureAsViewedService = async (formData) => {
  const { data } = await axiosInstance.post(
    `/student/course-progress/mark-lecture-viewed`,
    formData
  );
  return data;
};
export const resetCourseProgressService = async (formData) => {
  const { data } = await axiosInstance.post(
    `/student/course-progress/reset-progress`,
    formData
  );
  return data;
};
