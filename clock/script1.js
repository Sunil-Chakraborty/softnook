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

    istHeading.textContent = `USA Time Zones Conversion from IST (${istTime})`; // Update heading with IST time
}

// Update IST time initially
updateISTTime();

// Update IST time every second
setInterval(updateISTTime, 1000);

document.addEventListener('DOMContentLoaded', function() {
    // Get the audio player element
    const audioPlayer = document.getElementById('audio-player');

    // Add a click event listener to the document body
    document.body.addEventListener('click', function() {
        // Toggle playback of the audio player when the body is clicked
        if (audioPlayer.paused) {
            audioPlayer.play(); // If paused, play the audio
			const modal = document.getElementById('modal');

			
			document.getElementById('closeModal').addEventListener('click', function() {
				toggleModal();
			});
			
        } else {
            audioPlayer.pause(); // If playing, pause the audio
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Get the modal element
    const modal = document.getElementById('modal');

    // Function to toggle modal visibility
    function toggleModal() {
        modal.style.display = (modal.style.display === 'none' || modal.style.display === '') ? 'flex' : 'none';
    }

    // Add event listener to show modal when clicking outside the footer
    document.body.addEventListener('click', function(event) {
        if (!event.target.closest('#footer')) {
            toggleModal();
        }
    });

    
});
