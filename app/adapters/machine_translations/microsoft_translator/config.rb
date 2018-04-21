module MachineTranslations
  module MicrosoftTranslator
    class Config
      class << self
        def api_key
          Figaro.env.microsoft_translation_api_key
        end
      end
    end
  end
end
