class User < ApplicationRecord
  include Clearance::User

  enum registration_status: [:not_approved, :approved, :rejected]

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :password, presence: true, confirmation: true, length: { minimum: 8 }
  validates_acceptance_of :age
end
