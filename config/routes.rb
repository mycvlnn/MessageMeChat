Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  scope '(:locale)', locale: /en|vi/ do
    root 'conversations#index'

    # Authentication routes
    get 'login', to: 'sessions#new'
    post 'login', to: 'sessions#create'
    delete 'logout', to: 'sessions#destroy'
    get 'signup', to: 'users#new'
    post 'signup', to: 'users#create'

    # Chat routes
    resources :conversations, only: [:index, :create] do
      resources :messages, only: [:index, :create]
    end
  end

  
end
