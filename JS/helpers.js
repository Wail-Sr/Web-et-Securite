export function calculateDaysBetweenDates(date1, date2) {
  if (!date1 || !date2) {
    return 0;
  }

  // Parse the dates to ensure they are in Date object format
  const startDate = new Date(date1);
  const endDate = new Date(date2);

  // Check if the dates are valid
  if (isNaN(startDate) || isNaN(endDate)) {
    return 0; // Invalid date input
  }

  // Normalize the dates to ignore the time portion by setting the time to UTC midnight
  const utcStartDate = Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const utcEndDate = Date.UTC(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );

  // Get the time difference in milliseconds
  const timeDiff = utcEndDate - utcStartDate;

  // Convert the time difference from milliseconds to days
  const daysDifference = timeDiff / (1000 * 3600 * 24);

  console.log("Nombre de jours entre les dates :", daysDifference);
  return daysDifference;
}
