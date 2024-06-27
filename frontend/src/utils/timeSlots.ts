
export const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let hour = 9; hour <= 17; hour++) {
    const paddedHour = hour.toString().padStart(2, '0'); // Ensure two digits
    slots.push(`${paddedHour}:00`);
    if (hour !== 17) slots.push(`${paddedHour}:30`);
  }
  return slots;
};
