// Chat functionality
document.addEventListener("DOMContentLoaded", function () {
    // Auto scroll to bottom of messages
    const messagesArea = document.getElementById("messagesArea");
    if (messagesArea) {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    // Optional: Scroll to bottom after sending message
    const messageForm = document.querySelector(".message-input-area form");
    if (messageForm) {
        messageForm.addEventListener("submit", function () {
            setTimeout(() => {
                if (messagesArea) {
                    messagesArea.scrollTop = messagesArea.scrollHeight;
                }
            }, 100);
        });
    }
});
