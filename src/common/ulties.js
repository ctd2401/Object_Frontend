// Lấy time trong ngày dạng ISO 
export const setTimeISO = (hour, minute = 0) => {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};
