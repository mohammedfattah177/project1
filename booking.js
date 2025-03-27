document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      selectable: true,
      dateClick: function(info) {
        var date = new Date(info.date);
        var isTuesday = date.getDay() === 2;
        var isEverySecondSaturday = (date.getDay() === 6) && (Math.ceil(date.getDate() / 7) % 2 === 1);
  
        if (isTuesday || isEverySecondSaturday) {
          showPopup(info.dateStr);
        } else {
          alert('Vi har kun åbent tirsdag og hver anden lørdag.');
        }
      }
    });
  
    calendar.render();
  
    function showPopup(dateStr) {
      var availableTimes = generateTimes(dateStr);
      document.getElementById('availableTimes').innerHTML = availableTimes.map(time => 
        `<button class="time-button" ${isTimeBooked(dateStr, time) || isTimePast(dateStr + " " + time) ? 'disabled' : ''} data-date="${dateStr}" data-time="${time}">${time}</button>`
      ).join('<br>');
  
      document.getElementById('overlay').style.display = 'block';
      document.getElementById('timePopup').style.display = 'block';
  
      document.querySelectorAll('.time-button').forEach(button => {
        button.addEventListener('click', function() {
          if (!button.disabled) {
            var selectedDate = button.getAttribute('data-date');
            var selectedTime = button.getAttribute('data-time');
            bookTime(selectedDate, selectedTime);
            alert(`Booking bekræftet: ${selectedDate} kl. ${selectedTime}`);
            closePopup();
          }
        });
      });
    }
  
    function closePopup() {
      document.getElementById('overlay').style.display = 'none';
      document.getElementById('timePopup').style.display = 'none';
    }
  
    document.getElementById('closePopup').addEventListener('click', closePopup);
  
    function generateTimes(dateStr) {
      var times = [];
      var startTime = 9 * 60;
      var endTime = (new Date(dateStr).getDay() === 6) ? 14 * 60 + 15 : 17 * 60;
  
      while (startTime < endTime) {
        var hours = Math.floor(startTime / 60);
        var minutes = startTime % 60;
        times.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
        startTime += 45;
      }
  
      return times;
    }
  
    function isTimePast(datetime) {
      return new Date(datetime) < new Date();
    }
  
    function bookTime(date, time) {
      var bookings = JSON.parse(localStorage.getItem('bookings')) || {};
      if (!bookings[date]) bookings[date] = [];
      bookings[date].push(time);
      localStorage.setItem('bookings', JSON.stringify(bookings));
    }
  
    function isTimeBooked(date, time) {
      var bookings = JSON.parse(localStorage.getItem('bookings')) || {};
      return bookings[date] && bookings[date].includes(time);
    }
  });
  