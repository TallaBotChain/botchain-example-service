class Registration < ApplicationRecord
  belongs_to :user

  enum status: [:not_approved, :approved, :rejected]

  validates :network_id, presence: true

end
