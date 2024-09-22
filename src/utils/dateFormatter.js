export const formattedDate = (date) => {
  if (date === null) {
    return null;
  }
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
