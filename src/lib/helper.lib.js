const timeStringToSeconds = (timeString) => {
    if (!timeString.includes(':')) return;
    const [minutes, seconds] = timeString.split(':');
    return Number(minutes) * 60 + Number(seconds);
  }

const secondsToTimeString = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }


module.exports = {
    timeStringToSeconds,
    secondsToTimeString
}