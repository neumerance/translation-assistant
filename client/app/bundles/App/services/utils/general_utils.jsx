export const clearAllIntervals = () => {
  for (var i = 1; i < 99999; i++)
    window.clearInterval(i);
}