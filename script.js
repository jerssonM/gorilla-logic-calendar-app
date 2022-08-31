const MAX_DAYS_ON_MONTH = 42;
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
const currentDay = today.getDate();
const firstDayOfMonth = new Date(currentYear, currentMonth).getDay();
const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function setHtmlTextContent(id, text) {
  document.getElementById(id).innerText = text;
}

function appendChild(id, child) {
  document.getElementById(id).appendChild(child);
}

function createHtmlElement({ tag, id, className, textContent, onClickHandler }) {
  const element = document.createElement(tag);
  if (className) {
    element.classList.add(className);
  }
  if (id) {
    element.id = id;
  }
  if (textContent) {
    element.innerText = textContent;
  }
  if (onClickHandler) {
    element.setAttribute("onClick", onClickHandler);
  }
  return element;
}

function printCalendar() {
  let day = 1;
  setHtmlTextContent("appointment-month", MONTHS[currentMonth]);
  setHtmlTextContent("appointment-year", currentYear);
  for (let cell = 1; cell <= MAX_DAYS_ON_MONTH; cell++) {
    const dayElement = document.createElement("div");
    const isDayInMonth = cell >= firstDayOfMonth && day <= daysInMonth;
    const isValidDay = cell >= currentDay;
    if (isDayInMonth) {
      const dayElementId = `day-${day}`;
      dayElement.id = dayElementId;
      dayElement.innerText = day;
      dayElement.ariaChecked = "false";
      dayElement.classList.add("calendar-day-cell");
      dayElement.setAttribute("onClick", `dayCellEventHandler('${dayElementId}', '${day}', ${isValidDay})`);
      if (!isValidDay) {
        dayElement.classList.add("calendar-day-cell--inactive");
      }
      day++;
    } else {
      dayElement.classList.add("calendar-not-day-cell");
    }
    appendChild("days", dayElement);
  }
}

function dayCellEventHandler(elementId, day, isValidDay) {
  if (isValidDay) {
    addApointment(elementId, day);
  } else {
    alert("This isn't a valid date for an appointment.");
  }
}

function createAppointment(date, description, elementId) {
  const descriptionElementId = `appointment-description-${elementId}`;
  const appointmentElement = createHtmlElement({
    tag: "li",
    id: `appointment-${elementId}`,
    className: "appointment-list-item",
  });
  const appointmentDateElement = createHtmlElement({
    tag: "span",
    textContent: date,
    className: "appointment-list-item-date",
  });
  const appointmentDescriptionElement = createHtmlElement({
    tag: "span",
    textContent: description,
    id: descriptionElementId,
    className: "appointment-list-item-description",
  });
  const editButtonElement = createHtmlElement({
    tag: "button",
    textContent: "Edit",
    className: "appointment-list-button-edit",
    onClickHandler: `editAppointment('${descriptionElementId}', '${date}')`,
  });
  const deleteButtonElement = createHtmlElement({
    tag: "button",
    textContent: "Delete",
    className: "appointment-list-button-delete",
    onClickHandler: `deleteAppointment('${elementId}', '${date}')`,
  });
  const buttonsContainerElement = createHtmlElement({ tag: "div" });

  buttonsContainerElement.appendChild(editButtonElement);
  buttonsContainerElement.appendChild(deleteButtonElement);

  appointmentElement.appendChild(appointmentDateElement);
  appointmentElement.appendChild(appointmentDescriptionElement);
  appointmentElement.appendChild(buttonsContainerElement);

  appendChild("appointment-list", appointmentElement);
}

function addApointment(elementId, day) {
  const dayElement = document.getElementById(elementId);
  if (dayElement.ariaChecked === "true") {
    alert("There is already an appointment for this date.");
    return;
  }
  const appointmentDescription = prompt("Put the description for this appointment:");

  if (appointmentDescription !== null && appointmentDescription !== "") {
    const selectedDate = `${day}-${MONTHS[currentMonth]}-${currentYear}`;
    dayElement.classList.add("calendar-day-cell--selected");
    dayElement.ariaChecked = "true";
    createAppointment(selectedDate, appointmentDescription, elementId);
  }
}

function deleteAppointment(elementId, date) {
  const confirmDelete = confirm(`Delete appointment for ${date} `);
  if (confirmDelete) {
    const element = document.getElementById(elementId);
    element.classList.remove("calendar-day-cell--selected");
    element.ariaChecked = "false";
    document.getElementById(`appointment-${elementId}`).remove();
  }
}

function editAppointment(elementId, date) {
  const descriptionElement = document.getElementById(elementId);
  const appointmentDescription = prompt(`Edit description for appointment to ${date}`, descriptionElement.innerText);
  if (appointmentDescription !== null && appointmentDescription !== "") {
    setHtmlTextContent(elementId, appointmentDescription);
  }
}

printCalendar();
