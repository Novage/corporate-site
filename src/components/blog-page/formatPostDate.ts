export const formatPostDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
