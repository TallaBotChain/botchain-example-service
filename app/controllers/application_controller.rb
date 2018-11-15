class ApplicationController < ActionController::Base
  include Clearance::Controller
  force_ssl :except => [:health], :if => lambda { !Rails.env.development? && !Rails.env.test? }
  skip_before_action :verify_authenticity_token
end
