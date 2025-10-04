export default function formatDate(date1: Date, date2: Date) {
  if (date1 > date2) {
    throw new Error("Date 1 should be earlier than Date 2");
  }

  const diffYears = date2.getFullYear() - date1.getFullYear();
  const diffMonths = diffYears * 12 + (date2.getMonth() - date1.getMonth());
  const diffMs = date2.getTime() - date1.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMonths >= 12) {
    return `${Math.floor(diffMonths / 12)}y`;
  }

  if (diffMonths >= 1 && diffMinutes / 1440 >= 30) {
    return `${diffMonths}mo`;
  }

  if (diffMinutes >= 1440) {
    return `${Math.floor(diffMinutes / 1440)}d`;
  }

  if (diffMinutes >= 60) {
    return `${Math.floor(diffMinutes / 60)}h`;
  }

  return `${diffMinutes}m`;
}
