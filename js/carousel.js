
// import Hammer from 'hammerjs';

let intervalID;
let cardWidth = document.querySelector('.new-event-card').offsetWidth + 15;
const anchors = document.querySelectorAll('#events-nav-tag');
const cards = document.querySelectorAll('.new-event-card');
let cardsArray = Array.from(cards);

// // console.log("cards0", cardsArray[0]);

if (cardsArray.length > 1) {
    cardsArray.shift(); // Remove the first element from the array
    cardsArray.pop();   // Remove the last element from the array
}

// // console.log("crads, ", cardsArray);
const anchorsArray = Array.from(anchors);
let index = 0;

function scrollToPosition(elementToScroll) {
    const target = document.querySelector(elementToScroll);
    const container = document.querySelector('.event-cards-container');

    container.scrollTo({
        left: target.offsetLeft,
        behavior: 'smooth'
    });
}

// const eventContainer = document.querySelector(".event-cards-container");

// eventContainer.addEventListener("touchmove", function (e) {
//     if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
//         e.stopPropagation(); // Allow vertical scrolling
//     }
// }, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.event-cards-container');
    const firstCard = document.querySelector('#first-card');

    //     console.log("<<<<<<<<<<<<<<<<<");
    //     console.log("cardwidth: ", cardWidth);
    //  console.log("firstCard, ", firstCard);
    //     console.log("First Card Margin: ", window.getComputedStyle(firstCard).marginLeft);

    if (container && firstCard) {
        //         console.log("loaded");
        //  console.log("containerWidth ", container.offsetWidth);
        //         console.log("containerSpot ", container.offsetLeft);
        //         console.log("cardWidth ", firstCard.offsetLeft);
        //         console.log("scroll left, ", container.scrollLeft);

        scrollToPosition('#first-card');

        //  console.log("scrollLeft ", container.scrollLeft);

        //         console.log("scroll left, ", container.scrollLeft);

    }

    startInterval();
    setActiveButton();
    setActiveCard();
});

document.addEventListener('load', () => {
    const container = document.querySelector('.event-cards-container');
    const firstCard = document.querySelector('#first-card');
    if (container && firstCard) {
        scrollToPosition('#first-card');
    }

    startInterval();
    setActiveButton();
    setActiveCard();
});


// if (window.location.hash) {
//     history.replaceState(null, null, ' '); // Removes the hash from the URL without refreshing
// }

const hrefArray = document.querySelectorAll('#events-nav-tag');

hrefArray.forEach(anchor => {
    anchor.addEventListener('click', function (e) {

        // console.log("being pressed", this.getAttribute('href'));

        this.style.pointerEvents = "none";
        setTimeout(() => {
            this.style.pointerEvents = "auto";
        }, 100);

        e.preventDefault();
        history.replaceState(null, null, ' ');

        index = anchorsArray.indexOf(anchor);
        setActiveButton();

        setActiveCard();

        scrollToPosition(this.getAttribute('href'));

        resetInterval();


    });
});
/*
function setActiveButton() {

    // for (let i = 0; i < anchorsArray.length; i++) {
    //     if (i != index) {
    //         const button = anchorsArray[i].querySelector('button');
    //         if (button) button.style.transform = "";
    //     }
    // }
    anchorsArray.forEach(btn => btn.querySelector("button").style.transform = "");

    // Add 'active' class to the clicked button
    // this.classList.add('active');

    //     console.log(anchorsArray[index]);
    //     console.log(anchorsArray[index].querySelector('button'));
    const activeButton = anchorsArray[index].querySelector('button');
    if (activeButton) activeButton.style.transform = "scale(1.2)";





}
    */


function setActiveButton() {
    // First, reset all buttons
    anchorsArray.forEach(btn => {
        const button = btn.querySelector("button");
        if (button) button.classList.remove("active-button"); // Remove the class instead of modifying styles directly
        if (!button.classList.contains("inactive-button")) {
            button.classList.add("inactive-button");
        }
    });

    // Then, add 'active' class to the new clicked button
    const activeButton = anchorsArray[index].querySelector('button');
    if (activeButton) {
        activeButton.classList.add("active-button");
        if (activeButton.classList.contains("inactive-button")) {
            activeButton.classList.remove("inactive-button");
        }
    }

    anchorsArray.forEach(btn => {
        const button = btn.querySelector("button");
        if (button.classList.contains("active-button")) {
            //  console.log("HI");
        }
    })
}


// const buttons = document.querySelectorAll('.events-nav-button');

// buttons.forEach(button => {
//     button.addEventListener('click', function () {
//         // Remove 'active' class from all buttons
//         buttons.forEach(btn => btn.style.transform = "");

//         // Add 'active' class to the clicked button
//         this.style.transform = "scale(1.2)";
//     });
// });

function setActiveCard() {

    cardsArray.forEach((card, i) => {
        if (i === (index)) { //idk why, but the center card is not the current index
            card.style.opacity = "1";
        }
        else {
            card.style.opacity = ".5";
        }
    })
}

const container = document.querySelector('.event-cards-container');
let backScrollLeft = document.querySelector("#first-card").offsetLeft;
let frontScrollLeft = document.querySelector("#last-card").offsetLeft - cardWidth;
const eventBackButton = document.getElementById('back-button');
const eventFrontButton = document.getElementById('front-button');
eventBackButton.addEventListener('click', moveLeft);

eventFrontButton.addEventListener('click', moveRight);

container.addEventListener("wheel", function (event) {
    if (event.deltaX == 0) {
        event.preventDefault(); // Block horizontal scrolling
    }
}, { passive: false }); // Important to allow `preventDefault()`

// Create a manager to manager the element
var manager = new Hammer.Manager(container);

// var Tap = new Hammer.Tap();
// manager.add(Tap);

// Create a recognizer
var Swipe = new Hammer.Swipe({
    threshold: 2, // Minimum distance (px) before it's recognized as a swipe
    velocity: 0.2 // Adjust to require a faster or slower swipe
});

// Add the recognizer to the manager
manager.add(Swipe);

// Declare global variables to swiped correct distance
var deltaX = 0;
var deltaY = 0;

// Subscribe to a desired event
//2 is forward, 4 is backward, 8 is swipe up, 16 is swipe down
manager.on('swipe', function (e) {
    deltaX = deltaX + e.deltaX;
    var direction = e.offsetDirection;
    console.log("direction of swipe", direction);
    console.log("direction of swipe", direction);
    if (direction === 2) {
        moveRight();
    } else if (direction === 4) {
        moveLeft();
    }
    else if (direction === 8 || direction === 16) {

    }
});



function moveLeft() {
    console.log("scroll left called");
    cardWidth = document.querySelector('.new-event-card').offsetWidth + 15;
    backScrollLeft = document.querySelector("#first-card").offsetLeft;
    frontScrollLeft = document.querySelector("#last-card").offsetLeft - cardWidth;

    if (container.scrollLeft <= backScrollLeft) {
        console.log("here");
        index = anchorsArray.length - 1;
    }
    else {
        index--;
    }

    scrollToPosition(hrefArray[index].getAttribute('href'));


    const endScroll = container.scrollLeft;

    // //     console.log(endScroll);

    setActiveButton();

    setActiveCard();


    resetInterval();

}

function moveRight() {
    console.log("scroll right called");
    cardWidth = document.querySelector('.new-event-card').offsetWidth + 15;
    backScrollLeft = document.querySelector("#first-card").offsetLeft;
    frontScrollLeft = document.querySelector("#last-card").offsetLeft - cardWidth;

    // //     console.log("container ", container.offsetWidth);
    // //     console.log("first card ", backScrollLeft);


    if (container.scrollLeft >= frontScrollLeft) {
        // //         console.log("here");
        index = 0;
    }
    else {

        index++;
    }

    scrollToPosition(hrefArray[index].getAttribute('href'));

    // //     console.log(container.scrollLeft);

    setActiveButton();

    setActiveCard();

    resetInterval();

}

function resetInterval() {
    clearInterval(intervalID);
    startInterval();
}

function startInterval() {
    intervalID = setInterval(moveRight, 5000);
    // //     console.log("interval started");
}

function scrollToStudio() {
    const target = document.querySelector("#studio");

    if (target) {
        target.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to section
        history.replaceState(null, null, "#studio"); // Update URL without reloading
    }
}

function scrollToAbout() {
    const target = document.querySelector("#about");

    if (target) {
        target.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to section
        history.replaceState(null, null, "#about"); // Update URL without reloading
    }
}

function scrollToFAQ() {
    const target = document.querySelector("#faqs");

    if (target) {
        target.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to section
        history.replaceState(null, null, "#faqs"); // Update URL without reloading
    }
}



