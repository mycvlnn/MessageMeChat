import consumer from "./consumer";

let conversationSubscription = null;

const initializeConversationChannel = () => {
    const messagesArea = document.getElementById("messagesArea");
    if (!messagesArea) return;

    const conversationId = messagesArea.dataset.conversationId;
    const currentUserId = messagesArea.dataset.currentUserId;

    if (!conversationId || !currentUserId) return;

    // Unsubscribe existing subscription if any
    if (conversationSubscription) {
        conversationSubscription.unsubscribe();
    }

    conversationSubscription = consumer.subscriptions.create(
        {
            channel: "ConversationChannel",
            conversation_id: conversationId,
            user_id: currentUserId,
        },
        {
            connected() {
                console.log("Connected to conversation " + conversationId);
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
              ${this.escapeHtml(message.body)}
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

                const messageInput = document.querySelector(".message-input");
                if (messageInput) {
                    messageInput.value = "";
                }

                // Thực hiện xóa read indicators cũ khi có tin nhắn mới
                const myMessages = document.querySelectorAll(".message-wrapper.sent");
                if (myMessages.length === 0) return;

                // Xóa tất cả read indicators cũ
                myMessages.forEach((msg) => {
                    const oldIndicator = msg.querySelector(".read-indicator");
                    if (oldIndicator) {
                        oldIndicator.remove();
                    }
                });
            },

            handleTyping(data) {
                if (data.user_id == currentUserId) return;

                const typingIndicator = document.getElementById("typingIndicator");
                if (!typingIndicator) return;

                if (data.typing) {
                    typingIndicator.textContent = `${data.user} is typing...`;
                    typingIndicator.style.visibility = "visible";
                    // Thêm padding-bottom cho messages-area để không bị che
                    messagesArea.style.paddingBottom = "50px";
                    messagesArea.scrollTop = messagesArea.scrollHeight;
                } else {
                    typingIndicator.style.visibility = "hidden";
                    // Xóa padding-bottom khi typing indicator ẩn
                    messagesArea.style.paddingBottom = "30px";
                }
            },

            handleReadReceipt(data) {
                if (data.reader_id == currentUserId) return;

                // Chỉ hiển thị "Seen at" trên tin nhắn cuối cùng của mình
                const myMessages = document.querySelectorAll(".message-wrapper.sent");
                if (myMessages.length === 0) return;

                const lastMessage = myMessages[myMessages.length - 1];

                // Xóa tất cả read indicators cũ
                myMessages.forEach((msg) => {
                    const oldIndicator = msg.querySelector(".read-indicator");
                    if (oldIndicator) {
                        oldIndicator.remove();
                    }
                });

                // Chỉ thêm indicator vào tin nhắn cuối cùng
                if (!lastMessage.querySelector(".read-indicator")) {
                    const indicator = document.createElement("small");
                    indicator.className = "read-indicator text-muted ms-2";
                    indicator.style.display = "block";
                    indicator.style.fontSize = "0.75rem";
                    indicator.style.whiteSpace = "nowrap";

                    const now = new Date();
                    const timeString = now.toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                    indicator.textContent = `Seen at ${timeString}`;

                    lastMessage.querySelector(".message-bubble").appendChild(indicator);
                }
            },

            typing(isTyping) {
                this.perform("typing", { typing: isTyping });
            },

            markAsRead(senderId = null) {
                this.perform("mark_as_read", { sender_id: senderId });
            },

            speak(message) {
                this.perform("speak", { message: message });
            },

            escapeHtml(text) {
                const div = document.createElement("div");
                div.textContent = text;
                return div.innerHTML;
            },
        }
    );

    // Setup typing indicator after form is fully initialized
    // Use setTimeout to ensure it runs after message_form.js cloning
    setTimeout(() => {
        setupTypingIndicator(conversationSubscription);
    }, 50);
};

const setupTypingIndicator = (subscription) => {
    const messageInput = document.querySelector(".message-input");
    console.log({ messageInput });
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
};

// Support Turbolinks navigation
document.addEventListener("turbolinks:load", initializeConversationChannel);

// Cleanup on page unload
document.addEventListener("turbolinks:before-cache", () => {
    if (conversationSubscription) {
        conversationSubscription.unsubscribe();
        conversationSubscription = null;
    }
});
