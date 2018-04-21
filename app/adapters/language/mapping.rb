module Language
  class Mapping
    class << self
      def language_lists
        @data ||= begin
          path = Rails.root.join('app/adapters/language/languages.json')
          file = File.read(path)
          JSON.parse(file)
        end
      end

      def icl_format_iso_list
        @icl_format_iso_list ||= language_lists.map { |x| x['icl_format_iso'] }.compact.uniq
      end

      def to_ms_iso_format(language)
        lang = get_language_by_iso(language)
        lang.present? ? lang['ms_format_iso'] : language
      end

      def to_hunspell_iso_format(language)
        lang = get_language_by_iso(language)
        raise 'language code not supported' unless lang.present?
        lang['hunspell_iso_format']
      end

      def get_language_by_iso(language)
        language_lists.find do |x|
          x['icl_format_iso'] == language || x['wpml_iso_format'] == language
        end
      end
    end
  end
end
