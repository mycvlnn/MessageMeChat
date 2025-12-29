import consumer from "./consumer";

// Khởi tạo subscription khi có conversation_id trong DOM
document.addEventListener("DOMContentLoaded", () => {
    const messagesArea = document.getElementById("messagesArea");
    if (!messagesArea) return; // Không phải trang chat

    const conversationId = messagesArea.dataset.conversationId;
    const currentUserId = messagesArea.dataset.currentUserId;

    if (!conversationId || !currentUserId) return;

    // Subscribe to conversation channel
    const subscription = consumer.subscriptions.create(
        {
            channel: "ConversationChannel",
            conversation_id: conversationId,
            user_id: currentUserId,
        },
        {
            connected() {
                console.log("Connected to conversation " + conversationId);
                // Mark messages as read when connected
                this.markAsRead();
            },

            disconnected() {
                console.log("Disconnected from conversation");
            },

            received(data) {
                console.log("Received data:", data);

                switch (data.type) {
                    case "message":
                        this.appendMessage(data.message);
                        // Mark as read if not from current user
                        if (data.message.user_id != currentUserId) {
                            this.markAsRead(data.message.user_id);
                        }
                        break;
                    case "typing":
                        this.handleTyping(data);
                        break;
                    case "read_receipt":
                        this.handleReadReceipt(data);
                        break;
                }
            },

            // Append new message to chat
            appendMessage(message) {
                const isMine = message.user_id == currentUserId;
                const messageHTML = `
        <div class="message-wrapper ${isMine ? "sent" : "received"}" data-message-id="${
                    message.id
                }">
          ${
              !isMine
                  ? `
            <div class="message-avatar">
              <div class="avatar-circle-sm">
                ${message.username.charAt(0).toUpperCase()}
              </div>
            </div>
          `
                  : ""
          }
          <div class="message-bubble">
            ${message.body}
          </div>
          ${
              isMine
                  ? `
            <div class="message-avatar">
              <div class="avatar-circle-sm">
                ${message.username.charAt(0).toUpperCase()}
              </div>
            </div>
          `
                  : ""
          }
        </div>
      `;

                messagesArea.insertAdjacentHTML("beforeend", messageHTML);
                messagesArea.scrollTop = messagesArea.scrollHeight;

                // Clear input
                const messageInput = document.querySelector(".message-input");
                if (messageInput) {
                    messageInput.value = "";
                }
            },

            // Handle typing indicator
            handleTyping(data) {
                if (data.user_id == currentUserId) return; // Don't show own typing

                const typingIndicator = document.getElementById("typingIndicator");
                if (!typingIndicator) return;

                if (data.typing) {
                    typingIndicator.textContent = `${data.user} is typing...`;
                    typingIndicator.style.display = "block";
                } else {
                    typingIndicator.style.display = "none";
                }
            },

            // Handle read receipts
            handleReadReceipt(data) {
                if (data.reader_id == currentUserId) return;

                // Update UI to show messages as read
                const myMessages = document.querySelectorAll(".message-wrapper.sent");
                myMessages.forEach((msg) => {
                    // Add a "seen" indicator
                    if (!msg.querySelector(".read-indicator")) {
                        const indicator = document.createElement("small");
                        indicator.className = "read-indicator text-muted ms-2";
                        indicator.textContent = "Seen";
                        msg.querySelector(".message-bubble").appendChild(indicator);
                    }
                });
            },

            // Send typing status
            typing(isTyping) {
                this.perform("typing", { typing: isTyping });
            },

            // Mark messages as read
            markAsRead(senderId = null) {
                this.perform("mark_as_read", { sender_id: senderId });
            },

            // Send message (if you want to use ActionCable instead of form submit)
            speak(message) {
                this.perform("speak", { message: message });
            },
        }
    );

    // Handle typing indicator on input
    const messageInput = document.querySelector(".message-input");
    let typingTimer;

    if (messageInput) {
        messageInput.addEventListener("input", () => {
            subscription.typing(true);

            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => {
                subscription.typing(false);
            }, 1000);
        });

        messageInput.addEventListener("blur", () => {
            subscription.typing(false);
        });
    }
});
