class SessionsController < ApplicationController
  before_action :check_logged_in, only: %i[new create]

  def new
    # Login form
  end

  def create
    user = User.find_by(username: params[:username])
    if user&.authenticate(params[:password])
      session[:user_id] = user.id
      flash[:success] = 'You have successfully logged in!'
      redirect_to root_path
    else
      flash.now[:error] = 'Invalid username or password'
      render 'new'
    end
  end

  def destroy
    session[:user_id] = nil
    flash[:success] = 'You have successfully logged out'
    redirect_to login_path
  end

end