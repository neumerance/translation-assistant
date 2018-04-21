module CleanLocalization
  class Config
    class << self
      def load_data
        files.each_with_object({}) { |h, r| r.deep_merge!(h) }
      end

      private

      def files
        file_paths.map { |f| YAML.safe_load(File.read(f)) }
      end

      def file_paths
        Dir.open(base_path).select { |x| x.end_with?('.yml') }.map do |f|
          base_path.join(f).to_s
        end
      end

      def base_path
        @base_path ||= Rails.root.join('app/adapters/clean_localization/resources')
      end
    end
  end
end
