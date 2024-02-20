export const unitPriceLv = [
  { value: "BEGINNER", label: "초급" },
  { value: "HIGH_BEGINNER", label: "초급(상)" },
  { value: "MEDIUM_BEGINNER", label: "초급(중)" },
  { value: "LOW_BEGINNER", label: "초급(하)" },
  { value: "INTERMEDIATE", label: "중급" },
  { value: "HIGH_INTERMEDIATE", label: "중급(상)" },
  { value: "MEDIUM_INTERMEDIATE", label: "중급(중)" },
  { value: "LOW_INTERMEDIATE", label: "중급(하)" },
  { value: "ADVANCED", label: "고급" },
  { value: "HIGH_ADVANCED", label: "고급(상)" },
  { value: "MEDIUM_ADVANCED", label: "고급(중)" },
  { value: "LOW_ADVANCED", label: "고급(하)" },
  { value: "EXPERT", label: "특급" },
  { value: "HIGH_EXPERT", label: "특급(상)" },
  { value: "MEDIUM_EXPERT", label: "특급(중)" },
  { value: "LOW_EXPERT", label: "특급(하)" },
];

export const convertLevelEnToKo = (level: string): string => {
  const koLabel = unitPriceLv.find((up) => up.value === level);

  if (koLabel === undefined) return level;

  return koLabel.label;
};

export function getKoreaDateTime(): string {
  const koreaTimeZone = "Asia/Seoul"; // Time zone for Korea Standard Time
  const options: Intl.DateTimeFormatOptions = {
    timeZone: koreaTimeZone,
    hour12: false, // Use 24-hour format
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  return new Date().toLocaleString("en-US", options);
}
