export const calculateTimeUntilFree = (toDate) => {
    if (!toDate) return null;
  
    const now = new Date();
    const diff = toDate - now;
  
    if (diff < 0) return null;
  
    return {
      hours: Math.floor(diff / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      formatted: `${Math.floor(diff / 3600000)}:${Math.floor((diff % 3600000) / 60000)} left`,
    };
  };
  