// Chat functionality

const initializeChat = () => {
    // Auto scroll to bottom of messages
    const messagesArea = document.getElementById("messagesArea");
    if (messagesArea) {
        // Scroll immediately
        messagesArea.scrollTop = messagesArea.scrollHeight;

        // Also scroll after images/content loaded
        setTimeout(() => {
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }, 100);
    }

    // Auto scroll after form submission (handled in message_form.js)
    // Just focus on initial scroll here
};

// Support Turbolinks navigation
document.addEventListener("turbolinks:load", initializeChat);
