module WebtaSpellchecker
  class Client
    class Vocabulary
      attr_reader :path

      def initialize(path)
        @path = path
      end

      def words
        @words ||= begin
          row_separator = '/'
          word_records.map { |row| row.split(row_separator).first }
        end
      end

      def word_records
        file_content = File.read(path)
        string = file_content.encode('UTF-8', invalid: :replace, replace: '?')
        string.split("\n")
      end

      module Owner
        mattr_accessor :vocabulary
      end
    end
  end
end
