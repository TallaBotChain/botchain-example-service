Rails.application.routes.draw do
  resources :passwords, controller: "clearance/passwords", only: [:create, :new]
  resource :session, controller: "sessions", only: [:create]

  resources :users, controller: "users", only: [:create, :update] do
    resource :password,
      controller: "clearance/passwords",
      only: [:create, :edit, :update]
  end

  get "/sign_in" => "sessions#new", as: "sign_in"
  delete "/sign_out" => "sessions#destroy", as: "sign_out"
  get "/sign_up" => "users#new", as: "sign_up"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  constraints Clearance::Constraints::SignedIn.new do
    root to: "pages#developer"
    get "/settings" => "pages#developer", as: "settings"
    get "/help" => "pages#developer", as: "help"
  end

  constraints Clearance::Constraints::SignedOut.new do
    root to: "pages#home"
  end

end
