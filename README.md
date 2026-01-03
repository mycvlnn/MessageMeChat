# Message Me - Real-time Chat Application

A real-time messaging application built with Ruby on Rails 6, featuring instant messaging, typing indicators, and read receipts.

## Features

### 🔐 Authentication

-   User registration with username and password
-   Secure login/logout using `bcrypt` for password encryption
-   Session-based authentication
-   Form validation with error messages

### 💬 Real-time Messaging

-   Instant message delivery using **Action Cable** (WebSockets)
-   One-on-one conversations between users
-   Message history with timestamps
-   Auto-scroll to latest messages
-   Message input with Enter key support

### 👀 Advanced Chat Features

-   **Typing indicators**: See when the other person is typing
-   **Read receipts**: "Seen at HH:MM" indicators for sent messages
-   **Real-time updates**: Messages appear instantly without page refresh
-   **Conversation persistence**: All messages saved to database

### 🎨 User Interface

-   Responsive design with **Bootstrap 5**
-   Split-view layout:
    -   Left sidebar: Conversations list with user avatars
    -   Right panel: Active chat window
-   Modern chat bubble design
-   Avatar circles with user initials
-   Empty state messages for new conversations

### 🔍 Conversation Management

-   View all active conversations
-   Search and start new conversations
-   Conversation list shows last message preview
-   Conversations sorted by most recent activity
-   Modal dialog for starting new chats

## Technology Stack

-   **Backend**: Ruby 3.1.7, Rails 6.1.7
-   **Database**: SQLite3
-   **Real-time**: Action Cable (WebSockets)
-   **Frontend**:
    -   JavaScript (ES6+)
    -   Turbolinks for fast page navigation
    -   Webpacker for asset bundling
-   **Styling**:
    -   Bootstrap 5
    -   SASS/SCSS
    -   Custom CSS for chat interface
-   **Authentication**: bcrypt for secure passwords

## Installation

### Prerequisites

-   Ruby 3.1.7
-   Node.js and Yarn
-   SQLite3

### Setup Steps

```bash
# Clone the repository
git clone https://github.com/mycvlnn/MessageMeChat.git
cd message-me-chat

# Install dependencies
bundle install
yarn install

# Setup database
rails db:create
rails db:migrate

# Start the server
rails server

# In another terminal, start webpack dev server (for hot reloading)
./bin/webpack-dev-server
```
