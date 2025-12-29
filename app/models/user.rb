class User < ApplicationRecord
  validates :username, presence: true, uniqueness: { case_sensitive: false }, 
                       length: { minimum: 3, maximum: 25 }
  has_secure_password
  
  # Associations
  has_many :messages, dependent: :destroy
  has_many :sent_conversations, foreign_key: :sender_id, class_name: 'Conversation', dependent: :destroy
  has_many :received_conversations, foreign_key: :recipient_id, class_name: 'Conversation', dependent: :destroy
  
  # Method để lấy tất cả conversations của user
  def conversations
    Conversation.where("sender_id = ? OR recipient_id = ?", id, id)
  end
end
