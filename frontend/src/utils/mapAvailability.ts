interface TimeRange {
  start: number;
  end: number;
}

const parseTimeRange = (range: string): TimeRange => {
  const [start, end] = range.split(' - ').map((time) => {
    const [hour, period] = time.split(/am|pm/).map((t) => t.trim());
    const h = parseInt(hour, 10);
    const isPM = time.includes('pm') && h !== 12;
    const isAM = time.includes('am') && h === 12;
    return (isPM ? h + 12 : isAM ? 0 : h) * 100;
  });
  return { start, end };
};

export const mapAvailability = (
  availability: { [key: string]: string },
  slots: string[]
) => {
  const mapped: { [key: string]: string[] } = {};
  Object.entries(availability).forEach(([day, timeRange]) => {
    if (day === '_id') return;
    const { start, end } = parseTimeRange(timeRange);
    mapped[day] = slots.map((slot) => {
      const [hour, minutes] = slot.split(':').map(Number);
      const time = hour * 100 + minutes;
      return time >= start && time < end ? 'Available' : '';
    });
  });
  return mapped;
};
