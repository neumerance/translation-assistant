module WebtaSpellchecker
  class Client
    class Factory
      class << self
        def get(lang)
          store[lang] ||= begin
            path = "#{config.root_dir}/#{lang}"
            dictionary_path = "#{path}.dic"
            affix_path = "#{path}.aff"
            build_client(affix_path, dictionary_path)
          end
        end

        def store
          @store ||= {}
        end

        def config
          @config ||= begin
            config_path = Rails.root.join('app/adapters/webta_spellchecker/resources/config.yml')
            data = YAML.safe_load(File.read(config_path))
            OpenStruct.new(data)
          end
        end

        private

        def build_client(affix_path, dictionary_path)
          vocabulary = WebtaSpellchecker::Client::Vocabulary.new(dictionary_path)
          client = Hunspell.new(affix_path, dictionary_path)
          client.extend(WebtaSpellchecker::Client::Vocabulary::Owner)
          client.vocabulary = vocabulary
          client
        end
      end
    end
  end
end
