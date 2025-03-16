document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("event-container")) {
        fetchEventsForEventsPage();
    } else if (document.querySelector(".gallery")) {
        fetchEventsForSlideshow();
    }
});

// index.html gallery
async function fetchEventsForEventsPage() {
    try {
        const response = await fetch("https://67sxoyzalltf7cnmecge2sj5yq0bckqd.lambda-url.us-east-2.on.aws", {
            method: 'GET',
            headers: { 'x-api-key': '7a055rda' }
        });

        if (!response.ok) {
            throw new Error(`HTTP ERROR, STATUS: ${response.status}`);
        }

        const data = await response.json();
        console.log("Event data:", data);
        
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
        console.log("Event data for slideshow:", data);
        
        // sort events by date and get the next 3
        const sortedEvents = sortEventsByDate(data);
        const upcomingEvents = getUpcomingEvents(sortedEvents);
        const nextThreeEvents = upcomingEvents.slice(0, 3);
        
        if (nextThreeEvents.length > 0) {
            // update slideshow with the upcoming events
            updateSlideshow(nextThreeEvents);
            updateMainEventCard(nextThreeEvents[0]);
        } else {
            console.log("No upcoming events to display in slideshow");
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
        return eventDate >= today;
    });
}

// update slideshow
function updateSlideshow(events) {
    const galleryContainer = document.querySelector(".gallery > div");
    if (!galleryContainer) {
        console.error("Gallery container not found");
        return;
    }
    
    galleryContainer.innerHTML = "";
    
    events.forEach(event => {
        const [year, month, day] = event.EventDate.split('-').map(num => parseInt(num, 10));
        const shortDate = `${month}/${day}`;
        
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
        
        const eventSpan = document.createElement("span");
        
        eventSpan.dataset.image = event.EventThumbnail || "./media/placeholder-event.jpg";
        eventSpan.dataset.date = formattedDate;
        eventSpan.dataset.time = doorsTime;
        eventSpan.dataset.cost = price;
        eventSpan.dataset.link = event.EventUrl;
        eventSpan.dataset.title = event.EventName;
        
        eventSpan.innerHTML = `
            <div class="event-date-label">
                <p>${shortDate}</p>
            </div>
            <img src="${event.EventThumbnail || './media/placeholder-event.jpg'}" onerror="this.src='./media/placeholder-event.jpg'">
        `;
        
        eventSpan.addEventListener("click", () => {
            updateMainEvent(eventSpan);
        });

        galleryContainer.appendChild(eventSpan);
    });
    
    const firstEvent = galleryContainer.querySelector("span");
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
    mainEventImage.onerror = function() { this.src = './media/placeholder-event.jpg'; };
    
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

function formatTime(timeStr) {
    if (!timeStr) return "TBA";
    
    if (timeStr.includes(':')) {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}${ampm}`;
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