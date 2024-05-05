$(document).ready(function() {
  
  var triggeredAlarms = []; // Array to store triggered alarms
  var alarmTable = $('#alarm-table').DataTable({
    columns: [
      { title: 'Start Date' },
      { title: 'Medicine' },
      { title: 'Narration' },
      { title: 'Timing' },
      { title: 'Weekdays' },
      { title: 'Days' },
      { title: 'Actions', orderable: false }
    ],
    order: [[0, 'asc']]
  });

  loadDataFromStorage(); // Load alarms from localStorage

  // Check for triggered alarms every second
  setInterval(function() {
    checkAndTriggerAlarms();
  }, 1000);

  $('#alarm-form').submit(function(event) {
    event.preventDefault(); // Prevent default form submission

    // Retrieve form input values
    var startDate = $('#alarm-date').val();
    var medicine = $('#alarm-catg').val();
    var narration = $('#alarm-comment').val();
    var timing = ''; // Concatenated timing values for selected checkboxes
    var weekdays = []; // Array to store selected weekdays
    var days = $('#alarm-days').val();

    // Iterate through weekdays checkboxes to get selected values
    $('input[name="weekday"]:checked').each(function() {
      weekdays.push($(this).val()); // Store selected weekday value
    });

    // Concatenate selected timing values
    $('.weekday-time').each(function() {
      if ($(this).val()) {
        timing += $(this).val() + ', ';
      }
    });

    // Remove trailing comma and space from timing string
    timing = timing.replace(/, $/, '');

    // Format start date to a specific format (d-m-yy)
    const formattedDate = new Date(startDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });

    // Add new alarm data to localStorage
    var newAlarm = {
      startDate: formattedDate,
      medicine: medicine,
      narration: narration,
      timing: timing,
      weekdays: weekdays,
      days: days
    };

    saveAlarmToStorage(newAlarm);

    addRowToDataTable(newAlarm);

    // Reset form fields after adding alarm
    $('#alarm-form')[0].reset();
  });

  $('#alarm-table').on('click', '.delete-btn', function() {
    var rowData = alarmTable.row($(this).parents('tr')).data();
    deleteAlarmFromStorage(rowData[0]);
    alarmTable.row($(this).parents('tr')).remove().draw(false);
  });

  function saveAlarmToStorage(alarm) {
    var alarms = JSON.parse(localStorage.getItem('alarms')) || [];
    alarms.push(alarm);
    localStorage.setItem('alarms', JSON.stringify(alarms));
  }

  function loadDataFromStorage() {
    var alarms = JSON.parse(localStorage.getItem('alarms')) || [];
    alarms.forEach(function(alarm) {
      addRowToDataTable(alarm);
    });
  }

  function addRowToDataTable(alarm) {
    alarmTable.row.add([
      alarm.startDate,
      alarm.medicine,
      alarm.narration,
      alarm.timing,
      alarm.weekdays.join(', '),
      alarm.days,
      '<button class="edit-btn">Edit</button> <button class="delete-btn">Delete</button>'
    ]).draw(false);
  }

  function deleteAlarmFromStorage(startDate) {
    var alarms = JSON.parse(localStorage.getItem('alarms')) || [];
    alarms = alarms.filter(function(alarm) {
      return alarm.startDate !== startDate;
    });
    localStorage.setItem('alarms', JSON.stringify(alarms));
  }

  function checkAndTriggerAlarms() {
    var alarms = JSON.parse(localStorage.getItem('alarms')) || [];
    alarms.forEach(function(alarm) {
      if (!isAlarmTriggered(alarm) && isAlarmTimeReached(alarm)) {
        triggeredAlarms.push(alarm); // Mark alarm as triggered
        showAlarmNotification(alarm); // Display notification for new alarm
        console.log('Alarm triggered for:', alarm);
      }
    });
  }
 
  function isAlarmTimeReached(alarm) {
    const now = new Date();
    const [day, month, year] = alarm.startDate.split('/').map(Number);
    const [hours, minutes] = alarm.timing.split(':').map(Number);
    const alarmDateTime = new Date(2000 + year, month - 1, day, hours, minutes);
    return now >= alarmDateTime;
  }

  function isAlarmTriggered(alarm) {
    return triggeredAlarms.some(function(triggeredAlarm) {
      return (
        triggeredAlarm.startDate === alarm.startDate &&
        triggeredAlarm.timing === alarm.timing
      );
    });
  }

  function showAlarmNotification(alarm) {
    console.log('Attempting to display notification for:', alarm);

    if (!isAlarmTriggered(alarm)) {
      console.log('Notification not yet triggered. Displaying notification for:', alarm);
		$('#medicineName').text(alarm.medicine);
		$('#narrationText').text(alarm.narration);
		$('#alarmNotificationModal').modal('show');

		
		// Handle close button click event for the modal
		$('#alarmNotificationModal .btn-close').one('click', function() {
		  $('#alarmNotificationModal').modal('hide');
		  markAlarmAsTriggered(alarm);
		  console.log('Alarm notification closed for:', alarm);
		});
	    
    } else {
      console.log('Notification already triggered for:', alarm);
	    $('#medicineName').text(alarm.medicine);
		$('#narrationText').text(alarm.narration);
		$('#alarmNotificationModal').modal('show');


    }
  }

 
});
