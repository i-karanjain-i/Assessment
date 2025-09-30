/**
 * Simulate auto-clicker in Node.js (no external packages).
 * Instead of real mouse clicks, this calls a placeholder function.
 *
 * @param {number} count - Number of times to "click"
 * @param {number} interval - Interval in ms (default: 2 minutes)
 */
function autoClicker(count, interval = 120000) {
  let clicks = 0;

  const clickOnce = () => {
    if (clicks >= count) {
      console.log(`✅ Finished ${count} clicks`);
      return;
    }

    // Simulated click action (replace this with real mouse click if using robotjs etc.)
    console.log(`🖱️ Clicked ${++clicks}/${count} at ${new Date().toLocaleTimeString()}`);

    // Schedule next click
    setTimeout(clickOnce, interval);
  };

  clickOnce();
}

// Example: simulate 5 clicks every 2 minutes
autoClicker(300);
