class ConversationChannel < ApplicationCable::Channel
  def subscribed
    conversation = Conversation.find(params[:conversation_id])
    stream_for conversation
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
  
  # Receive message từ client
  def speak(data)
    conversation = Conversation.find(params[:conversation_id])
    message = conversation.messages.create!(
      body: data['message'],
      user: current_user
    )
  end
  
  # Typing indicator
  def typing(data)
    conversation = Conversation.find(params[:conversation_id])
    ConversationChannel.broadcast_to(
      conversation,
      type: 'typing',
      user: current_user.username,
      user_id: current_user.id,
      typing: data['typing']
    )
  end
  
  # Mark messages as read
  def mark_as_read(data)
    conversation = Conversation.find(params[:conversation_id])
    conversation.messages.where(user_id: data['sender_id'], read_at: nil)
                         .update_all(read_at: Time.current)
    
    ConversationChannel.broadcast_to(
      conversation,
      type: 'read_receipt',
      reader_id: current_user.id
    )
  end
  
  private
  
  def current_user
    User.find_by(id: params[:user_id])
  end
end
