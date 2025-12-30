// Handle message form submission via ActionCable (no page reload)

const initializeMessageForm = () => {
    const messageForm = document.querySelector(".message-input-area form");
    if (!messageForm) return;

    // Remove old listeners to prevent duplicates
    const newForm = messageForm.cloneNode(true);
    messageForm.parentNode.replaceChild(newForm, messageForm);

    const newInput = newForm.querySelector(".message-input");
    const newSubmitButton = newForm.querySelector('[type="submit"]');

    // Handle submit
    newForm.addEventListener("submit", (e) => {
        const message = newInput.value.trim();

        if (!message) {
            e.preventDefault();
            return;
        }

        // Clear input and scroll to bottom
        setTimeout(() => {
            newInput.value = "";
            const messagesArea = document.getElementById("messagesArea");
            if (messagesArea) {
                messagesArea.scrollTop = messagesArea.scrollHeight;
            }
        }, 10);
    });

    // Submit via Enter key
    newInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            newSubmitButton.click();
        }
    });
};

// Support Turbolinks navigation
document.addEventListener("turbolinks:load", initializeMessageForm);
