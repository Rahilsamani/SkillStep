const { default: mongoose } = require("mongoose");
const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const {
  paymentSuccessEmail,
} = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");

// capture the payment and initiate the razorpay  order
exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  if (!courses.length) {
    return res.json({ success: false, message: "Please provide Course ID(s)" });
  }

  let totalAmount = 0;
  try {
    for (const courseId of courses) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res
          .status(404)
          .json({ success: false, message: "Course not found" });
      }

      if (course.studentsEnrolled.includes(userId)) {
        return res
          .status(400)
          .json({ success: false, message: "Student already enrolled" });
      }

      totalAmount += course.price;
    }

    const currency = "INR";
    const options = {
      amount: totalAmount * 100,
      currency,
      receipt: crypto.randomBytes(16).toString("hex"),
    };

    const paymentResponse = await instance.orders.create(options);
    res.json({
      success: true,
      order: paymentResponse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Could not initiate order",
      error: error.message,
    });
  }
};

//verify signature of razorpay and server
exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    courses,
  } = req.body;
  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid payment details" });
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res);
    return res.status(200).json({
      success: true,
      message: "Payment verified and enrollment successful",
    });
  }

  return res.status(400).json({
    success: false,
    message: "Payment verification failed",
  });
};

// Enroll students after payment verification
const enrollStudents = async (courses, userId, res) => {
  if (!courses.length || !userId) {
    return res.status(400).json({
      success: false,
      message: "Invalid course or user data",
    });
  }

  try {
    for (const courseId of courses) {
      const enrolledCourse = await Course.findByIdAndUpdate(
        courseId,
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res
          .status(404)
          .json({ success: false, message: "Course not found" });
      }

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId,
        completedVideos: [],
      });

      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        { $push: { courses: courseId, courseProgress: courseProgress._id } },
        { new: true }
      );

      await mailSender(
        enrolledStudent.email,
        `Successfully enrolled in ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          enrolledStudent.firstName
        )
      );
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Incomplete payment details" });
  }

  try {
    const enrolledStudent = await User.findById(userId);
    await mailSender(
      enrolledStudent.email,
      "Payment Received",
      paymentSuccessEmail(
        enrolledStudent.firstName,
        amount / 100,
        orderId,
        paymentId
      )
    );

    return res
      .status(200)
      .json({ success: true, message: "Payment success email sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Could not send email",
      error: error.message,
    });
  }
};

