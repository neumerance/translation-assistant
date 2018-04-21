class WebtaSpellcheckerController < ApplicationController

  skip_before_action :verify_authenticity_token

  def spellcheck
    sp = WebtaSpellchecker::Client.new(params[:lang])
    render json: { data: sp.spellcheck(params[:sentence]) }
  rescue => e
    render json: e.as_json
  end

end
