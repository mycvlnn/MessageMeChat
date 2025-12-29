class ConversationsController < ApplicationController
  before_action :require_authentication
  
  def index
    @users = User.where.not(id: current_user.id)
    @conversations = current_user.conversations.includes(:messages).order('messages.created_at DESC')
  end
  
  def create
    # Kiểm tra xem conversation giữa 2 users đã tồn tại chưa
    @conversation = Conversation.between(current_user.id, params[:recipient_id]).first
    
    if @conversation.blank?
      @conversation = Conversation.create!(
        sender_id: current_user.id,
        recipient_id: params[:recipient_id]
      )
    end
    
    redirect_to conversation_messages_path(@conversation)
  end
  
 
end
