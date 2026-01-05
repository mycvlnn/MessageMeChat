module LocaleConcern 
  extend ActiveSupport::Concern
  included do
    around_action :switch_locale
  end

  def switch_locale(&action)
    locale = params[:locale] || session[:locale] || I18n.default_locale
    session[:locale] = locale
    I18n.with_locale(locale, &action)
  end

  def default_url_options
    { locale: I18n.locale }
  end
end
