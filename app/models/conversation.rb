class Conversation < ApplicationRecord
  belongs_to :sender, foreign_key: :sender_id, class_name: 'User'
  belongs_to :recipient, foreign_key: :recipient_id, class_name: 'User'
  
  has_many :messages, dependent: :destroy
  
  validates_uniqueness_of :sender_id, scope: :recipient_id
  
  # Scope để lấy conversations của một user
  scope :between, -> (sender_id, recipient_id) do
    where("(conversations.sender_id = ? AND conversations.recipient_id = ?) OR 
           (conversations.sender_id = ? AND conversations.recipient_id = ?)", 
           sender_id, recipient_id, recipient_id, sender_id)
  end
  
  # Method để lấy user còn lại trong conversation (không phải current_user)
  def opposed_user(user)
    user == sender ? recipient : sender
  end
  
  # Method để lấy tin nhắn gần nhất
  def last_message
    messages.order(created_at: :desc).first
  end
end
