function displayTime() {
    let date = new Date();

    // Indian Time
    let hhIndia = date.getHours();
    let mmIndia = date.getMinutes();
    let ssIndia = date.getSeconds();

    // USA Time (Eastern Time Zone, for example)
    let utcDate = new Date(date.toLocaleString("en-US", {timeZone: "America/New_York"}));
    let hhUSA = utcDate.getHours();
    let mmUSA = utcDate.getMinutes();
    let ssUSA = utcDate.getSeconds();

    // Calculate rotations for Indian clock
    let hRotationIndia = 30 * hhIndia + mmIndia / 2;
    let mRotationIndia = 6 * mmIndia;
    let sRotationIndia = 6 * ssIndia;

    // Calculate rotations for USA clock
    let hRotationUSA = 30 * hhUSA + mmUSA / 2;
    let mRotationUSA = 6 * mmUSA;
    let sRotationUSA = 6 * ssUSA;

    // Apply rotations to Indian clock
    document.getElementById("hour").style.transform = `rotate(${hRotationIndia}deg)`;
    document.getElementById("min").style.transform = `rotate(${mRotationIndia}deg)`;
    document.getElementById("sec").style.transform = `rotate(${sRotationIndia}deg)`;

    // Apply rotations to USA clock
    document.getElementById("hour-usa").style.transform = `rotate(${hRotationUSA}deg)`;
    document.getElementById("min-usa").style.transform = `rotate(${mRotationUSA}deg)`;
    document.getElementById("sec-usa").style.transform = `rotate(${sRotationUSA}deg)`;

    // Update date fields
    updateDateField(hhIndia, mmIndia, ssIndia, "date-india");
    updateDateField(hhUSA, mmUSA, ssUSA, "date-usa");
}

function updateDateField(hours, minutes, seconds, elementId) {
    const dateElement = document.getElementById(elementId);
    const formattedDate = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
    dateElement.textContent = formattedDate;
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// Refresh time and date every second
setInterval(displayTime, 1000);

// Initial display of time and date
displayTime();
