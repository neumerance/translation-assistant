module MachineTranslations
  module MicrosoftTranslator
    module Languages
      class List
        class << self
          def available_languages
            Language::Mapping.icl_format_iso_list
          end

          def valid_lang?(language)
            available_languages.include?(language.to_s)
          end
        end
      end
    end
  end
end
