class MachineTranslationsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def translate
    client = MachineTranslations::MicrosoftTranslator::Client.new(
      from_lang: params[:translate][:from_lang],
      to_lang: params[:translate][:to_lang]
    )
    render json: {
      status: 200,
      data: client.translate(text: params[:translate][:string])
    }
  rescue => e
    error = { error: e.as_json }
    error[:tag] = 'exception';
    error[:short_message] = 'api_exception';
    error[:exception_message] = e.message;
    Rails.logger.error error
    render json: {
      status: 500,
      error: error,
      message: 'Something went wrong'
    }
  end
end
