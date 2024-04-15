function displayTimeInTimeZone(timeZone, elementId) {
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: timeZone,
        timeZoneName: "short"
    };

    // Function to update the time display
    function updateTime() {
        const targetTime = new Date().toLocaleString("en-US", options);
        document.getElementById(elementId).textContent = targetTime;
    }

    // Update time immediately and then every second
    updateTime();
    setInterval(updateTime, 1000);
}

// Display times for different time zones relative to IST
displayTimeInTimeZone("America/Anchorage", "alaskaTime");
displayTimeInTimeZone("America/Chicago", "centralTime");
displayTimeInTimeZone("America/New_York", "easternTime");
displayTimeInTimeZone("Pacific/Honolulu", "hawaiiTime");
displayTimeInTimeZone("America/Denver", "mountainTime");
displayTimeInTimeZone("America/Los_Angeles", "pacificTime");


// Function to update the IST time in the heading
function updateISTTime() {
    const istHeading = document.getElementById('ist-heading');
    const now = new Date(); // Get current date and time
    const options = { timeZone: 'Asia/Kolkata', hour12: true, hour: 'numeric', minute: '2-digit' };
    const istTime = now.toLocaleTimeString('en-US', options); // Format IST time

    istHeading.textContent = `Time Zones Conversion from IST (${istTime})`; // Update heading with IST time
}

// Update IST time initially
updateISTTime();

// Update IST time every second
setInterval(updateISTTime, 1000);


