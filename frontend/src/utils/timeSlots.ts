
export const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour}:00`);
      if (hour !== 17) slots.push(`${hour}:30`);
    }
    return slots;
  };
  