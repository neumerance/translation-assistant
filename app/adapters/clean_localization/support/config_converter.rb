module CleanLocalization
  module Support
    class ConfigConverter
      def clean_to_i18n(clean_config)
        CleanToI18n.new.convert(clean_config)
      end

      def i18n_to_clean(i18n_config)
        I18nToClean.new.convert(i18n_config)
      end

      def dump_yaml(hash, path)
        File.open(path, 'w') { |f| f.write hash.to_yaml }
      end
    end
  end
end
