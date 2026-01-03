// Search conversations functionality

const initializeConversationSearch = () => {
    const searchInput = document.getElementById("searchInput");
    const conversationItems = document.querySelectorAll(".conversation-item");

    if (!searchInput || conversationItems.length === 0) return;

    searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();

        conversationItems.forEach((item) => {
            const username = item.querySelector(".conversation-name").textContent.toLowerCase();
            const preview = item.querySelector(".conversation-preview");
            const previewText = preview ? preview.textContent.toLowerCase() : "";

            // Search trong cả username và preview message
            if (username.includes(searchTerm) || previewText.includes(searchTerm)) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }
        });

        // Hiển thị "No results" nếu không tìm thấy gì
        const visibleItems = Array.from(conversationItems).filter(
            (item) => item.style.display !== "none"
        );

        let noResultsMessage = document.querySelector(".no-search-results");

        if (visibleItems.length === 0 && searchTerm !== "") {
            if (!noResultsMessage) {
                noResultsMessage = document.createElement("div");
                noResultsMessage.className = "no-search-results text-center text-muted p-4";
                noResultsMessage.innerHTML = "<p>No conversations found</p>";
                document.querySelector(".conversations-list").appendChild(noResultsMessage);
            }
            noResultsMessage.style.display = "block";
        } else {
            if (noResultsMessage) {
                noResultsMessage.style.display = "none";
            }
        }
    });

    // Clear search khi focus vào input
    searchInput.addEventListener("focus", () => {
        searchInput.select();
    });
};

// Support Turbolinks navigation
document.addEventListener("turbolinks:load", initializeConversationSearch);
