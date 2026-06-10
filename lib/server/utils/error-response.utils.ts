export const getClientErrorMessage = (error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : "Something went wrong";

  if (
    message.includes("Can't reach database server") ||
    message.includes("P1001")
  ) {
    return "Database is unavailable. Please start Postgres and try again.";
  }

  return message;
};
