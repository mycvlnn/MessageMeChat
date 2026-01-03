class ConversationChannel < ApplicationCable::Channel
  def subscribed
    stream_for conversation
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    stop_all_streams
  end
  
  # Receive message từ client
  def speak(data)
    message = conversation.messages.create!(
      body: data['message'],
      user: current_user
    )
  end
  
  # Typing indicator with throttling
  def typing(data)
    # Throttle typing broadcasts để tránh spam
    typing_key = "typing_#{conversation.id}_#{current_user.id}"
    last_typing_time = Rails.cache.read(typing_key)
    
    # Chỉ broadcast nếu đã qua 500ms từ lần cuối
    if last_typing_time.nil? || Time.current - last_typing_time > 0.5.seconds
      ConversationChannel.broadcast_to(
        conversation,
        type: 'typing',
        user: current_user.username,
        user_id: current_user.id,
        typing: data['typing']
      )
      Rails.cache.write(typing_key, Time.current, expires_in: 2.seconds)
    end
  end
  
  # Mark messages as read
  def mark_as_read(data)
    return unless data['sender_id']
    
    # Batch update để tránh N+1 query
    conversation.messages
               .where(user_id: data['sender_id'], read_at: nil)
               .update_all(read_at: Time.current)
    
    ConversationChannel.broadcast_to(
      conversation,
      type: 'read_receipt',
      reader_id: current_user.id
    )
  end
  
  private
  
  # Memoize conversation để tránh query nhiều lần
  def conversation
    @conversation ||= Conversation.find(params[:conversation_id])
  end
  
  # Memoize current_user để tránh query nhiều lần
  def current_user
    @current_user ||= User.find_by(id: params[:user_id])
  end
end
