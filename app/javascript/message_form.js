// Handle message form submission via ActionCable (no page reload)
document.addEventListener("DOMContentLoaded", () => {
    const messageForm = document.querySelector(".message-input-area form");
    if (!messageForm) return;

    const messageInput = messageForm.querySelector(".message-input");
    const submitButton = messageForm.querySelector('[type="submit"]');

    // Get the ActionCable subscription from conversation_channel.js
    // We'll use form submit normally but prevent reload for better UX
    messageForm.addEventListener("submit", (e) => {
        const message = messageInput.value.trim();

        if (!message) {
            e.preventDefault();
            return;
        }

        // Let the form submit normally
        // The message will be broadcast via after_create_commit callback
        // ActionCable will receive it and append to UI

        // Clear the input immediately for better UX
        setTimeout(() => {
            messageInput.value = "";
        }, 10);
    });

    // Optional: Submit via Enter key
    messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submitButton.click();
        }
    });
});
