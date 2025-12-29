class MessagesController < ApplicationController
  before_action :require_authentication
  before_action :set_conversation

  def index
    @messages = @conversation.messages.includes(:user).order(created_at: :asc)
    @message = @conversation.messages.new
    @opposed_user = @conversation.opposed_user(current_user)

    # Mark all messages from opposed user as read
    @conversation.messages
                 .where(user: @opposed_user)
                 .where(read_at: nil)
                 .update_all(read_at: Time.current)
  end

  def create
    @message = @conversation.messages.new(message_params)
    @message.user = current_user

    if @message.save
      # Message will be broadcast via after_create_commit callback
      respond_to do |format|
        format.html { redirect_to conversation_messages_path(@conversation) }
        format.js   # For AJAX requests (optional)
      end
    else
      flash[:error] = "Message could not be sent"
      redirect_to conversation_messages_path(@conversation)
    end
  end

  def set_conversation
    @conversation = Conversation.find(params[:conversation_id])
  end

  def message_params
    params.require(:message).permit(:body)
  end

end
