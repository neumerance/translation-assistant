require 'rails_helper'

describe WebtaSpellchecker::Client do
  let(:client) { described_class.new('en') }

  it 'should raise an error when language code is not defined' do
    expect { described_class.new }.to raise_error(StandardError)
  end

  describe '#spellcheck' do
    subject { client.spellcheck(sentence) }

    context 'Suggestions' do
      context 'when all words are correct' do
        let(:sentence) { 'Who let the dogs out?' }

        it { is_expected.to be_empty }
      end

      describe 'spelling corrections' do
        let(:sentence) { 'Wha lwt tha dwgs oyt?' }
        subject do
          client.spellcheck(sentence).find { |w| w[:word] == word }[:suggestions]
        end

        context 'when "Wha" misspelled' do
          let(:word) { 'Wha' }

          it { is_expected.to include('Who') }
          it { is_expected.to include('What') }
          it { is_expected.to include('Why') }
        end

        context 'when "lwt" misspelled' do
          let(:word) { 'lwt' }

          it { is_expected.to include('let') }
          it { is_expected.to include('lot') }
        end

        context 'when "tha" misspelled' do
          let(:word) { 'tha' }

          it { is_expected.to include('the') }
          it { is_expected.to include('than') }
          it { is_expected.to include('that') }
        end

        context 'when "dwgs" misspelled' do
          let(:word) { 'dwgs' }

          it { is_expected.to include('dogs') }
          it { is_expected.to include('digs') }
        end

        context 'when "oyt" misspelled' do
          let(:word) { 'oyt' }

          it { is_expected.to include('out') }
          it { is_expected.to include('toy') }
        end
      end
    end

    context 'Punctuation' do
      context 'when exclamation' do
        let(:sentence) { 'Hello my dear spell checker!' }

        it { is_expected.to be_empty }
      end

      context 'when question mark' do
        let(:sentence) { 'Is this a good sentence for you?' }
        it { is_expected.to be_empty }
      end

      context 'when commas' do
        let(:sentence) { 'Apple, orange and mango.' }
        it { is_expected.to be_empty }
      end
    end

    context 'Dates' do
      let(:sentence) { 'My birthday is 21/03/1990.' }

      context 'when dd/mm/yyyy' do
        it { is_expected.to be_empty }
      end

      context 'when natural date' do
        let(:sentence) { 'My birthday is April 15, 1987.' }

        it { is_expected.to be_empty }
      end
    end

    context 'abbreviations' do
      let(:sentence) { 'ASAP' }

      it { is_expected.to be_empty }

      context do
        let(:sentence) { 'ETA' }
        it { is_expected.to be_empty }
      end

      context do
        let(:sentence) { 'PS' }
        it { is_expected.to be_empty }
      end

      context 'when non recognized Abbv' do
        let(:sentence) { 'VITALY' }
        it { is_expected.to_not be_empty }
      end
    end

    context 'Names' do
      let(:word) { 'pablo' }

      subject { client.spellcheck(word).first[:suggestions] }

      context 'when name is recognized' do
        it { is_expected.to include(word.titleize) }
      end

      context 'when other recognized name' do
        let(:word) { 'lisa' }
        it { is_expected.to include(word.titleize) }
      end

      context 'when name is not recognized' do
        let(:word) { 'vitaly' }
        it { is_expected.to_not include(word.titleize) }
      end
    end

    context 'sentence cleanup' do
      let(:sentence) { 'Jon&nbsp;has&nbsp;many&nbsp;dogs...' }
      let(:cleaned_sentence) { 'Jon has many dogs' }
      subject { client.send :cleaned_sentence, sentence }
      context 'when sentence has html entities' do
        it { is_expected.to eq cleaned_sentence }
      end

      context 'when sentence has html tags' do
        let(:sentence) { '<div><strong>Jon</strong> has many dogs</div>' }
        it { is_expected.to eq cleaned_sentence }
      end

      context 'when sentence has multiple punctuations' do
        let(:sentence) { 'Jon, Vitaly and Bruno have lots of dogs...' }
        let(:cleaned_sentence) { 'Jon Vitaly and Bruno have lots of dogs' }
        it { is_expected.to eq cleaned_sentence }
      end

      context 'when sentence has multiple complexities' do
        let(:sentence) { '<strong>Jon</strong>, <strong>Vitaly</strong>&nbsp;and&lt;<strong>Bruno</strong>&gt;have lots of dogs...' }
        let(:cleaned_sentence) { 'Jon Vitaly and Bruno have lots of dogs' }
        it { is_expected.to eq cleaned_sentence }
      end
    end
  end
end
