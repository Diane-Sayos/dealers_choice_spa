const axios = require('axios');

const volunteerList = document.querySelector('#volunteer-list');
const taskList = document.querySelector('#task-list');
const assignedTaskList = document.querySelector('#assignedTask-list');
const volunteerInfo = document.querySelector('#volunteer-info');
const completedTaskList = document.querySelector('#completedTask-list');
const firstNameInput = document.querySelector('#firstName');
const lastNameInput = document.querySelector('#lastName');
const phoneInput = document.querySelector('#phone');
const emailInput = document.querySelector('#email');
const form = document.querySelector('#form');

let volunteers;
let tasks;
let assignedTasks;
let completedTasks = [];

const fetchAssignedTasks = async() => {
  const id = window.location.hash.slice(1);
  if(id){
    const response = await axios.get(`/volunteers/${id}/assignedTask`);
    assignedTasks = response.data;
  } else {
    assignedTasks = [];
  }
}
const fetchTasks = async() => {
  const response = await axios.get('/tasks');
  tasks = response.data;
}
const fetchVolunteers = async() => {
  const response = await axios.get('/volunteers');
  volunteers = response.data;
}
window.addEventListener('hashchange', async() => {
  renderVolunteers();
  await fetchAssignedTasks();
  renderVolunteerData();
  renderTasks();
  renderAssignedTasks();
  renderCompletedTasks();
});
form.addEventListener('submit', async(e) => {
  e.preventDefault();
  const firstName = firstNameInput.value;
  const lastName = lastNameInput.value;
  const phone = phoneInput.value;
  const email = emailInput.value;
  const response = await axios.post('/volunteers',{
    firstName,
    lastName,
    phone,
    email
  });
  volunteers.push(response.data);
[firstNameInput.value, lastNameInput.value, phoneInput.value, emailInput.value] = ['', '', '', '']
  fetchVolunteers();
  renderVolunteers();
  renderVolunteerData();
});

volunteerInfo.addEventListener('click', async(e) => {
  if(e.target.tagName === 'BUTTON'){
    const id = e.target.getAttribute('data-id')*1;
    await axios.delete(`/volunteers/${id}`);
    volunteers = volunteers.filter(volunteer => volunteer.id !== id)
  }
  fetchVolunteers();
  renderVolunteers();
  renderVolunteerData();
  fetchAssignedTasks();
  renderAssignedTasks();
});
taskList.addEventListener('click', async(e) => {
  if(e.target.tagName === 'BUTTON'){
    const volunteerId = window.location.hash.slice(1)*1;
    const taskId = e.target.getAttribute('data-id');
    const response = await axios.post(`/volunteers/:${volunteerId}/assignedTask`, {
      volunteerId,
      taskId
    });
    assignedTasks.push(response.data);
    renderTasks();
    renderAssignedTasks();
    renderCompletedTasks();
  }
});
assignedTaskList.addEventListener('click', async(e) => {
  if(e.target.tagName === 'BUTTON'){
    const assignedId = e.target.getAttribute('data-id')*1;
    const response = assignedTasks.find(assignedTask => assignedTask.id === assignedId);
    completedTasks.push(response);
    // await axios.delete(`/volunteers/assignedTask/${assignedId}`);
    assignedTasks = assignedTasks.filter(assignedTask => assignedTask.id !== assignedId);
  }
  fetchAssignedTasks();
  renderAssignedTasks();
  renderCompletedTasks();
});
//render list of volunteers
const renderVolunteers = () => {
  const hash = window.location.hash.slice(1);
  const html = volunteers.map(volunteer => {
    return `
    <li ${hash*1 === volunteer.id ? "class='selected'" : ""}>
    <a href='#${volunteer.id}'>${volunteer.fullName}</a>
    </li>
    `;
  }).join('');
  volunteerList.innerHTML = html;
};
//render volunteer information
const renderVolunteerData = () => {
  const hash = window.location.hash.slice(1)*1;
  if(hash){
    const volunteerData = volunteers.find(volunteer => volunteer.id === hash);
    if(volunteerData){
      console.log(volunteerData)
      const html = `
      <li class='info'>Full Name:</li>
      <li>${volunteerData.fullName}</li>
      <li class='info'>Phone Number:</li>
      <li>${volunteerData.phone}</li>
      <li class='info'>Email:</li>
      <li>${volunteerData.email}</li>
      <li><button data-id='${volunteerData.id}'>Delete Volunteer</button></li>
      `;
      volunteerInfo.innerHTML = html;
    }
  }
}
//render list of tasks
const renderTasks = () => {
  const html = tasks.map(task => {
    return `
    <li>
      ${task.name} <br/>
      <button type='submit' data-id='${task.id}'>Assign Task</button>
    </li>
    `;
  }).join('');
  taskList.innerHTML = html;
};
//render tasks added to specific volunteer
const renderAssignedTasks = () => {
  const html = assignedTasks.map(assignedTask => {
    const task = tasks.find(task => task.id === assignedTask.taskId)
    return `
    <li>
    ${task.name}
    <button data-id='${assignedTask.id}'>√</button>
    </li>
    `;
  }).join('');
  assignedTaskList.innerHTML = html;
};
//render tasks completed from to do list
const renderCompletedTasks = () => {
  const hash = window.location.hash.slice(1)*1;
  completedTasks= completedTasks.filter(completedTask => completedTask.volunteerId === hash);
  const html = completedTasks.map(completedTask => {
    
    const task = tasks.find(task => task.id === completedTask.taskId)
    return `
    <li>${task.name}</li>
    `;
  }).join('');
  completedTaskList.innerHTML = html;
};

const start = async() => {
    await fetchVolunteers();
    await fetchTasks();
    await fetchAssignedTasks();
    renderVolunteers();
    renderTasks();
    renderVolunteerData();
    renderAssignedTasks();
    renderCompletedTasks();
};
start();