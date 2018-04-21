module WebtaSpellchecker
  class Client
    attr_reader :lang, :hunspell

    def initialize(lang)
      @lang = Language::Mapping.to_hunspell_iso_format(lang)
      @hunspell = Client::Factory.get(@lang)
    end

    def spellcheck(sentence)
      res = misspelled_words(sentence).map do |word|
        {
          word: word,
          suggestions: suggestions(word)
        }
      end

      res.select { |h| sentence.include?(h[:word]) && h[:suggestions].present? }
    end

    private

    def suggestions(word)
      suggested_words = hunspell.suggest(word)
      reduce_suggestions(word, suggested_words)
    end

    def reduce_suggestions(word, suggested_words)
      Reducer.new(hunspell).reduce(word, suggested_words)
    end

    def words(sentence)
      cleaned_sentence(sentence).split(' ')
    end

    def cleaned_sentence(sentence)
      sentence.gsub(/&[^ ;]+;/i, ' ').gsub(/[[:punct:]]/, ' ').gsub(/<\/?[^>]*>/, ' ').squeeze(' ').strip
    end

    def misspelled_words(sentence)
      words(sentence).reject { |w| hunspell.spellcheck(w) }
    end
  end
end
