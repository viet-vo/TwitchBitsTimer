function startTimer() {
    let totalTime = 120; // 2 minutes in seconds
    let timerDisplay = document.getElementById('timer'); // Replace 'timer' with the ID of your timer element
  
    function formatTime(time) {
      const minutes = Math.floor(time / 60).toString().padStart(2, '0');
      const seconds = (time % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    }
  
    function updateTimer() {
      timerDisplay.textContent = formatTime(totalTime);
      totalTime--;
  
      if (totalTime < 0) {
        clearInterval(timerInterval);
        timerDisplay.textContent = `Time's up!`;
        // Perform any action you want when the timer ends
      }
    }
    console.log("timer start")
    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
  }
  
  // Start the timer
  startTimer();