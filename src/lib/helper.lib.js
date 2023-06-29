const timeStringToSeconds = (timeString) => {
  if (!timeString.includes(":")) return;
  const [minutes, seconds] = timeString.split(":");
  return Number(minutes) * 60 + Number(seconds);
};

const secondsToTimeString = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const calculateEstimatedReadTime = (text) => {
  const words = text.split(" ");
  const numWords = words.length;
  const readingTime = Math.round(numWords / 200);
  return readingTime;
};

module.exports = {
  timeStringToSeconds,
  secondsToTimeString,
  calculateEstimatedReadTime,
};
