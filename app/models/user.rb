class User < ApplicationRecord
  include Clearance::User

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :password, presence: true, confirmation: true, length: { minimum: 8 }
  validates_acceptance_of :age
end
