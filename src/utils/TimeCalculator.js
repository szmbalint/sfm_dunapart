export const calculateTimeUntilFree = (toDate) => {
    if (!toDate) return null;
  
    const now = new Date();
    const diff = toDate - now;
  
    if (diff < 0) return null;
  
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      formatted: `${Math.floor(diff / 86400000) > 0 ? String(Math.floor(diff / 86400000)).padStart(2, '0') + ':' : ''}${String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0')}:${String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0')} left`,
    };
    

  };
  