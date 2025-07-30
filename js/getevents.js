document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("event-container")) {
        fetchEventsForEventsPage();
    } if (document.querySelector(".event-line-section")) {
        fetchEventsForEventsList();
    } if (document.querySelector(".event-cards-container")) {
        fetchEventsForSlideshow();
    }
});
// fetchEventsForSlideshow();
// fetchEventsForEventsList();
// fetchEventsForEventsPage();

document.addEventListener("resize", () => {
    //     console.log("hi screen width, ", document.body.offsetWidth);
    //     console.log("hi event card width, ", document.querySelector(".new-event-card").offsetWidth);
})

// index.html gallery
async function fetchEventsForEventsPage() {
    //     console.log("fetchEventsForEventsPage");
    try {
        const response = await fetch("https://67sxoyzalltf7cnmecge2sj5yq0bckqd.lambda-url.us-east-2.on.aws", {
            method: 'GET',
            headers: { 'x-api-key': '7a055rda' }
        });

        if (!response.ok) {
            throw new Error(`HTTP ERROR, STATUS: ${response.status}`);
        }

        const data = await response.json();
        //         console.log("Event data:", data);

        const sortedEvents = sortEventsByDate(data);

        const loadingElement = document.getElementById('loading-events');
        if (loadingElement) {
            loadingElement.remove();
        }

        displayEvents(sortedEvents);
    }
    catch (error) {
        console.error("Error fetching event data:", error);
        const loadingElement = document.getElementById('loading-events');
        if (loadingElement) {
            loadingElement.innerHTML = `
                <div style="color: red; padding: 20px;">
                    Error loading events. Please try again later.
                </div>
            `;
        }
    }
}

async function fetchEventsForSlideshow() {
    try {
        const response = await fetch("https://67sxoyzalltf7cnmecge2sj5yq0bckqd.lambda-url.us-east-2.on.aws", {
            method: 'GET',
            headers: { 'x-api-key': '7a055rda' }
        });

        if (!response.ok) {
            throw new Error(`HTTP ERROR, STATUS: ${response.status}`);
        }

        const data = await response.json();
        //         console.log("Event data for slideshow:", data);

        // sort events by date and get the next 3
        const sortedEvents = sortEventsByDate(data);
        const upcomingEvents = getUpcomingEvents(sortedEvents);
        const nextTwoEvents = upcomingEvents.slice(0, 2);

        if (nextTwoEvents.length > 0) {
            // update slideshow with the upcoming events
            updateSlideshow(nextTwoEvents);
            // updateMainEventCard(nextThreeEvents[0]);
        } else {
            //             console.log("No upcoming events to display in slideshow");
        }
    }
    catch (error) {
        console.error("Error fetching event data for slideshow:", error);
    }
}

async function fetchEventsForEventsList() {
    //     console.log("fetcheventsforeventlist");
    try {
        const response = await fetch("https://67sxoyzalltf7cnmecge2sj5yq0bckqd.lambda-url.us-east-2.on.aws", {
            method: 'GET',
            headers: { 'x-api-key': '7a055rda' }
        });

        if (!response.ok) {
            throw new Error(`HTTP ERROR, STATUS: ${response.status}`);
        }

        const data = await response.json();
        //         console.log("Event data for slideshow:", data);

        // sort events by date and get the next 3
        const sortedEvents = sortEventsByDate(data);
        const upcomingEvents = getUpcomingEvents(sortedEvents);
        const nextThreeEvents = upcomingEvents.slice(0, 3);
        //used to test for when there are no events
        // const test = [];

        if (nextThreeEvents.length > 0) {
            // update slideshow with the upcoming events
            updateEventsList(nextThreeEvents);
        } else {
            //             console.log("No upcoming events to display in slideshow");
        }
    }
    catch (error) {
        console.error("Error fetching event data for slideshow:", error);
    }
}

function sortEventsByDate(events) {
    return events.sort((a, b) => {
        const [yearA, monthA, dayA] = a.EventDate.split('-').map(num => parseInt(num, 10));
        const [yearB, monthB, dayB] = b.EventDate.split('-').map(num => parseInt(num, 10));

        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);

        return dateA - dateB;
    });
}

function getUpcomingEvents(events) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events.filter(event => {
        const [year, month, day] = event.EventDate.split('-').map(num => parseInt(num, 10));
        const eventDate = new Date(year, month - 1, day);
        return eventDate >= today && event.ShowPublic;
    });
}

// update slideshow
function updateSlideshow(events) {
    const eventCardsContainer = document.querySelector(".event-cards-container");
    if (!eventCardsContainer) {
        console.error("Event cards container not found");
        return;
    }

    // const cardsToPopulate = ["event-1", "event-3", "event-4"];
    const cardsToPopulate = ["event-1", "event-4"];

    //     // console.log("Looking for IDs:", cardsToPopulate);
    // cardsToPopulate.forEach(id => {
    //     //     console.log(`Checking ID ${id}:`, document.getElementById(id));
    // });

    //     // console.log("asflkjas df;lk , ", document.querySelector(".event-cards-container"));

    events.forEach((event, index) => {
        const [year, month, day] = event.EventDate.split('-').map(num => parseInt(num, 10));
        const shortDate = `${month}/${day}`;

        const eventDate = new Date(year, month - 1, day);
        const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const formattedDate = `${dayNames[eventDate.getDay()]}, ${monthNames[eventDate.getMonth()]} ${day}`;

        const doorsTime = event.EventDoorsOpen ? formatTime(event.EventDoorsOpen) : "TBA";

        // const eventSpan = document.createElement("div");

        //         console.log("Index, ", cardsToPopulate[index]);
        const eventCard = document.getElementById(cardsToPopulate[index]);
        eventCard.style.backgroundImage = `url('${event.EventThumbnail || './media/placeholder-event.jpg'}')`;


        eventCard.innerHTML = `
         <div class="new-event-title">
                                    ${event.EventName}<br>
                                    <i>Get Your Tickets Now!</i>
                                </div>

                                <div class="new-event-button">


                                    <button
                                        onclick="window.open('${event.EventUrl}' , '_blank');">
                                        TICKETS
                                    </button>
                                </div>
                                `;

        //         console.log("Evnetcard, ", eventCard);
    });

    const firstEvent = eventCardsContainer.querySelector("span");
    if (firstEvent) {
        firstEvent.click();
    }
}

function updateMainEventCard(event) {
    const mainEventCard = document.querySelector(".event-card");
    if (!mainEventCard) {
        console.error("Main event card not found");
        return;
    }

    const mainEventImage = mainEventCard.querySelector(".event-image img");
    const mainEventInfo = mainEventCard.querySelectorAll(".event-item");
    const mainEventTitle = mainEventCard.querySelector(".event-title");

    const [year, month, day] = event.EventDate.split('-').map(num => parseInt(num, 10));
    const eventDate = new Date(year, month - 1, day);
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const formattedDate = `${dayNames[eventDate.getDay()]}, ${monthNames[eventDate.getMonth()]} ${day}`;

    const doorsTime = event.EventDoorsOpen ? formatTime(event.EventDoorsOpen) : "TBA";

    let price = "TBA";
    if (event.ticketTypes && event.ticketTypes.length > 0) {
        const prices = event.ticketTypes.map(ticket => ticket.Price);
        const lowestPrice = Math.min(...prices);
        price = `$${lowestPrice.toFixed(2)}`;
    }

    mainEventImage.src = event.EventThumbnail || "./media/placeholder-event.jpg";
    mainEventImage.onerror = function () { this.src = './media/placeholder-event.jpg'; };

    mainEventInfo[0].textContent = formattedDate;
    mainEventInfo[1].textContent = doorsTime;
    mainEventInfo[2].textContent = price;

    const ticketLink = mainEventInfo[3].querySelector("a");
    if (ticketLink) {
        ticketLink.href = event.EventUrl;
    }

    mainEventTitle.textContent = event.EventName;
}

// Events page
function displayEvents(events) {
    const eventContainer = document.getElementById("event-container");
    if (!eventContainer) {
        console.error("Event container not found");
        return;
    }

    const futureEvents = getUpcomingEvents(events);

    if (futureEvents.length === 0) {
        eventContainer.innerHTML = '<div style="text-align: center; padding: 40px;">No upcoming events at this time. Check back soon!</div>';
        return;
    }

    futureEvents.forEach(event => {
        const [year, month, day] = event.EventDate.split('-').map(num => parseInt(num, 10));
        const eventDate = new Date(year, month - 1, day);
        const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

        const formattedDate = `${dayNames[eventDate.getDay()]}, ${monthNames[eventDate.getMonth()]} ${day}`;

        const doorsTime = event.EventDoorsOpen ? formatTime(event.EventDoorsOpen) : "TBA";

        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';

        let price = "TBA";
        if (event.ticketTypes && event.ticketTypes.length > 0) {
            const prices = event.ticketTypes.map(ticket => ticket.Price);
            const lowestPrice = Math.min(...prices);
            price = `$${lowestPrice.toFixed(2)}`;
        }

        eventCard.innerHTML = `
            <div class="event-title">${event.EventName}</div>
            
            <div class="event-image">
                <img src="${event.EventThumbnail || './media/placeholder-event.jpg'}" alt="${event.EventName}" onerror="this.src='./media/placeholder-event.jpg'">
            </div>
            
            <div class="event-info">
                <div class="event-item">${formattedDate}</div>
                <div class="event-item">${doorsTime}</div>
                <div class="event-item">${price}</div>
                <div class="event-item" id="ticket-link">
                    <a href="${event.EventUrl}" target="_blank">TICKETS</a>
                </div>
            </div>
        `;

        eventContainer.appendChild(eventCard);
    });
}

function updateEventsList(events) {
    //     console.log("updateEventsList");
    const eventListContainer = document.querySelector(".event-line-section");
    if (!eventListContainer) {
        console.error("Event container not found");
        return;
    }

    if (events.length === 0) {
        eventListContainer.innerHTML = '<div style="text-align: center; padding: 40px; font-size: 2vw; font-family: \'Inter\'; font-weight: 450;">No upcoming events at this time. Check back soon!</div>';
        return;
    }


    events.forEach(event => {
        const [year, month, day] = event.EventDate.split('-').map(num => parseInt(num, 10));
        const eventDate = new Date(year, month - 1, day);
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

        const formattedDate = `${monthNames[eventDate.getMonth()]} ${day}`;

        const eventCard = document.createElement('div');
        eventCard.className = 'event-line';

        eventCard.innerHTML = `
            <div class="event-line-info">
                                <div class="event-line-title">
                                    <div class="event-line-container">
                                        <h1>
                                            ${event.EventName}
                                        </h1>
                                     
                                    </div>
                                </div>
                               
                            </div>
                            <div class="event-line-buttons">
                                <div class="date">
                                    ${formattedDate}
                                </div>
                                <a href="${event.EventUrl}" target="_blank" class="tickets">
                                    TICKETS
                                </a>
                            </div>
        `;

        eventListContainer.appendChild(eventCard);
    });

    const contentButton = document.createElement('div');
    // contentButton.className = 'content-button';
    contentButton.style.width = "100%";
    contentButton.innerHTML = `
    <a href="events.html"  style="text-decoration: none; display: flex; justify-content: center;">
        <div class="content-button">
VIEW ALL UPCOMING EVENTS        </div>
    </a>
`;
    eventListContainer.appendChild(contentButton);
}

function formatTime(timeStr) {
    if (!timeStr) return "TBA";
    //     console.log("formatTIme", timeStr);

    if (timeStr.includes(':')) {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        if (minutes === '00') {
            return `${hour12}${ampm}`;
        } else {
            return `${hour12}:${minutes} ${ampm}`;
        }
    }

    return timeStr;
}

function updateMainEvent(card) {
    const mainEventCard = document.querySelector(".event-card");
    if (!mainEventCard) return;

    const mainEventImage = mainEventCard.querySelector(".event-image img");
    const mainEventInfo = mainEventCard.querySelectorAll(".event-item");
    const mainEventTitle = mainEventCard.querySelector(".event-title");

    mainEventImage.src = card.dataset.image;
    mainEventInfo[0].textContent = card.dataset.date;
    mainEventInfo[1].textContent = card.dataset.time;
    mainEventInfo[2].textContent = card.dataset.cost;
    mainEventInfo[3].querySelector("a").href = card.dataset.link;
    mainEventTitle.textContent = card.dataset.title;
}