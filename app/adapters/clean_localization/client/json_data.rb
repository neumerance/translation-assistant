module CleanLocalization
  class Client
    class JsonData
      def initialize(language, data)
        @language = language
        @data = data
      end

      def build_hash
        build_flat_records
      end

      def render
        build_hash.to_json
      end

      private

      def build_flat_records
        res = {}
        build_record(@data, nil, res)
        res
      end

      def build_record(hash, key, res)
        if hash.keys.include?(PRIMARY_LOCALE)
          value = hash.keys.include?(@language) ? hash[@language] : hash[primary_locale]
          res[key] = value
        else
          hash.each do |cur_key, next_hash|
            next_key = [key, cur_key].compact.join('.')
            build_record(next_hash, next_key, res)
          end
        end
      end

      PRIMARY_LOCALE = 'en'.freeze

      def primary_locale
        PRIMARY_LOCALE
      end
    end
  end
end
