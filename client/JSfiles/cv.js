document.getElementById('addExperience').addEventListener('click', function() {
    var newExperience = document.createElement('div');
    newExperience.className = 'single_experience';
    newExperience.innerHTML = `
      <div class="place_position">
        <p contenteditable="true">Time</p>
        <p contenteditable="true">Place</p>
        <p contenteditable="true">Position</p>
      </div>
      <p contenteditable="true">Description</p>
      <h3>Tasks:</h3>
      <ul class="tasks">
        <li contenteditable="true">Task</li>
      </ul>
      <h3>Achievements:</h3>
      <ul class="achievements">
        <li contenteditable="true">Achievement</li>
      </ul>
    `;
    document.querySelector('.experience').appendChild(newExperience);
  });

document.getElementById('addLicence').addEventListener('click', function() {
  var newLicence = document.createElement('div');
  newLicence.className = 'licence';
  newLicence.innerHTML = `
    <div class="left">
      <p>License</p>
      <p>Place</p>
    </div>
    <div class="middle">
      <p>Date</p>
    </div>
    <div class="right">
      <p>Description</p>
    </div>
  `;
  document.querySelector('.licenses').appendChild(newLicence);
});

document.getElementById('addEducation').addEventListener('click', function() {
  var newEducation = document.createElement('div');
  newEducation.className = 'place';
  newEducation.innerHTML = `
    <div class="left">
      <p>Place</p>
      <p>Start - End</p>
      <p>Year of graduation: Year</p>
    </div>
    <div class="right">
      <p>Course</p>
      <p>Type</p>
      <p>Specialty: Specialty</p>
    </div>
  `;
  document.querySelector('.education').appendChild(newEducation);
});