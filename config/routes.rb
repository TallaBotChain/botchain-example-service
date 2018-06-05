Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  constraints Clearance::Constraints::SignedIn.new do
    root to: "pages#developer"
  end

  constraints Clearance::Constraints::SignedOut.new do
    root to: "pages#home"
  end

end
