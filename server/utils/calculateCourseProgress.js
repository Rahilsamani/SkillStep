calculateCourseProgress = (completedLectures, totalLectures) => {
  if (!Array.isArray(completedLectures) || !Array.isArray(totalLectures)) {
    throw new Error("Both completedLectures and totalLectures must be arrays");
  }

  const completedCount = completedLectures.length;
  const totalCount = totalLectures.length;

  if (totalCount === 0) return 0;

  const progressPercentage = (completedCount / totalCount) * 100;
  return Math.round(progressPercentage);
};

module.exports = {
  calculateCourseProgress,
};
