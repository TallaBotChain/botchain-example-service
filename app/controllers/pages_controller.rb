class PagesController < ApplicationController

  def home
  end

  def developer
    render html: '', layout: 'botchain'
  end

end
