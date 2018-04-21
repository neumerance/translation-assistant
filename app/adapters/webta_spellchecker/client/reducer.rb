module WebtaSpellchecker
  class Client
    class Reducer
      NON_REDUCE_LIMIT = 5
      DISTANCE_LEVEL_LIMIT = 2
      LIMIT = 7

      attr_reader :hunspell

      def initialize(hunspell)
        @hunspell = hunspell
      end

      def reduce(word, suggested_words)
        analyzed_words = suggested_words.map do |sw|
          h = { word: sw, original: word, distance: Levenshtein.distance(word, sw) }
          OpenStruct.new(h)
        end

        analyzed_words = reduce_by_distance(analyzed_words)
        sort(analyzed_words)[0...LIMIT]
      end

      private

      def reduce_by_distance(analyzed_words)
        return analyzed_words if analyzed_words.size <= NON_REDUCE_LIMIT
        distances = analyzed_words.map(&:distance).uniq.sort
        max_distance = distances[0...DISTANCE_LEVEL_LIMIT].compact.last

        analyzed_words.select { |aw| aw.distance <= max_distance }
      end

      def sort(analyzed_words)
        # pp analyzed_words.sort_by { |aw| sort_condition(aw) }.map{ |aw| sort_condition(aw) + [aw.word] }
        analyzed_words.sort_by { |aw| sort_condition(aw) }.map(&:word)
      end

      def sort_condition(aw)
        [
          vocabulary_word?(aw.word),
          aw.distance,
          starts_with_same_letter?(aw),
          aw.word.size,
          aw.word
        ]
      end

      def starts_with_same_letter?(aw)
        aw.original.chars.first == aw.word.chars.first ? -1 : 1
      end

      def vocabulary_word?(word)
        hunspell.vocabulary.words.include?(word.mb_chars.downcase.to_s) ? -1 : 1
      end
    end
  end
end
