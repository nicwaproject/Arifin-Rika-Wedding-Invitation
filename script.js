document.addEventListener("DOMContentLoaded", function() {
    // Function to get URL parameters
    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Set couple names from URL parameter or use default
    const coupleNames = getQueryParameter('couple');
    const coupleNamesElement = document.getElementById('coupleNames');
    if (coupleNamesElement) {
        coupleNamesElement.textContent = coupleNames || 'Arifin & Rika'; // Default names
    }

    // Set guest name from URL parameter or use default
    const guestName = getQueryParameter('guest');
    const guestNameElement = document.getElementById('guestName');
    if (guestNameElement) {
        guestNameElement.textContent = guestName || 'Guest';
    }

    // Variables for the invitation and music
    const openButton = document.getElementById('openButton');
    const invitationCover = document.getElementById('invitationCover');
    const invitationContent = document.getElementById('invitationContent');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const playPauseButton = document.getElementById('playPauseButton');
    const audioControls = document.querySelector('.audio-controls');
    let isPlaying = false;

    // Event listener to open the invitation and start music
    if (openButton) {
        openButton.addEventListener('click', function() {
            if (invitationCover) invitationCover.style.display = 'none';
            if (invitationContent) invitationContent.style.display = 'flex';
            if (audioControls) audioControls.style.display = 'block'; // Show the audio controls
            togglePlayPause();
        });
    }

    // Function to toggle play/pause for the music
    function togglePlayPause() {
        if (backgroundMusic) {
            if (isPlaying) {
                backgroundMusic.pause();
            } else {
                backgroundMusic.play();
            }
            isPlaying = !isPlaying;
            if (playPauseButton) {
                playPauseButton.src = isPlaying ? 'pause.png' : 'play-button.png'; // Change this to the path of your play and pause button images
            }
        }
    }

    // Event listener for the play/pause button
    if (playPauseButton) {
        playPauseButton.addEventListener('click', togglePlayPause);
    }

    // Countdown Timer
    function calculateCountdown() {
        const weddingDate = new Date('2024-07-20T10:00:00'); // Set your wedding date here
        const currentDate = new Date();
        let timeRemaining = weddingDate - currentDate;

        if (timeRemaining <= 0) {
            clearInterval(intervalId);
            timeRemaining = 0;
        }

        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    }

    const intervalId = setInterval(calculateCountdown, 1000);
    calculateCountdown();

    // Function to show animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const elements = document.querySelectorAll('.fade-in, .fade-slide');
    elements.forEach(element => {
        observer.observe(element);
    });

    // Function to handle message form submission
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('formGuestName').value;
            const message = document.getElementById('guestMessage').value;

            fetch('https://arifin-rika.glitch.me/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, message })
            })
            .then(response => response.json())
            .then(data => {
                loadMessages();
                messageForm.reset();
            })
            .catch(error => console.error('Error:', error));
        });
    }

    // Function to load messages
    function loadMessages() {
        fetch('https://arifin-rika.glitch.me/messages')
            .then(response => response.json())
            .then(data => {
                const messageList = document.getElementById('messageList');
                if (messageList) {
                    messageList.innerHTML = '';
                    data.forEach(msg => {
                        const messageItem = document.createElement('div');
                        messageItem.classList.add('message'); // Add 'message' class

                        // Element for the author
                        const authorElement = document.createElement('div');
                        authorElement.classList.add('message-author');
                        authorElement.textContent = msg.name;

                        // Element for the content
                        const contentElement = document.createElement('div');
                        contentElement.classList.add('message-content');
                        contentElement.textContent = msg.message;

                        // Element to contain both the author and the content
                        const bodyElement = document.createElement('div');
                        bodyElement.classList.add('message-body');
                        bodyElement.appendChild(authorElement);
                        bodyElement.appendChild(contentElement);

                        // Append the bodyElement to the messageItem
                        messageItem.appendChild(bodyElement);

                        // Append the messageItem to the messageList
                        messageList.appendChild(messageItem);
                    });
                }
            })
            .catch(error => console.error('Error:', error));
    }

    window.onload = loadMessages;
});
