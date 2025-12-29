class Message < ApplicationRecord
  belongs_to :conversation
  belongs_to :user

  validates_presence_of :body, :conversation_id, :user_id

  # Broadcast message qua ActionCable
  after_create_commit :broadcast_message

  # Helper để check xem message này có phải của current_user không
  def mine?(current_user)
    user == current_user
  end

  # Check if message has been read
  def read?
    read_at.present?
  end

  def broadcast_message
    ConversationChannel.broadcast_to(
      conversation,
      type: 'message',
      message: {
        id: id,
        body: body,
        user_id: user.id,
        username: user.username,
        created_at: created_at.strftime('%H:%M'),
        read_at: read_at
      }
    )
  end
end
