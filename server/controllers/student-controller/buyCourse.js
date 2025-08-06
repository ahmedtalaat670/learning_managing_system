const StudentCourses = require("../../models/studentCourses");
const Course = require("../../models/courses");

const buyCourse = async (req, res) => {
  try {
    const {
      userId,
      studentName,
      studentEmail,
      paidAmount,
      courseId,
      courseTitle,
      instructorId,
      instructorName,
      dateOfPurchase,
      courseImage,
    } = req.body;
    const existingUser = await StudentCourses.findOne({ userId });
    if (existingUser) {
      existingUser.courses.push({
        courseId,
        title: courseTitle,
        instructorId,
        instructorName,
        dateOfPurchase,
        courseImage,
      });
      await existingUser.save();
    } else {
      const newUser = new StudentCourses({
        userId,
        courses: [
          {
            courseId,
            title: courseTitle,
            instructorId,
            instructorName,
            dateOfPurchase,
            courseImage,
          },
        ],
      });
      await newUser.save();
    }
    const existingCourse = await Course.findById(courseId);
    if (existingCourse) {
      existingCourse.students.push({
        studentId: userId,
        studentName,
        studentEmail,
        paidAmount,
      });
      await existingCourse.save();
    }
    res.status(201).json({
      success: true,
      message: "the process is done successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

module.exports = { buyCourse };
