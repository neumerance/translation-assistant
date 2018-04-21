require 'rails_helper'

describe WebtaSpellchecker::Client do
  let(:client) { described_class.new('uk') }

  describe '#spellcheck' do
    subject { client.spellcheck(sentence) }

    context 'Suggestions' do
      context 'when all words are correct' do
        let(:sentence) { 'Хто випустив собаку?' }

        it { is_expected.to eq [] }
      end

      context 'when all words are incorrect' do
        let(:sentence) { 'Хро віпустив собіку?' }

        let(:result) do
          [
            {
              word: 'Хро',
              suggestions: %w(Хто Про Яро Хром Іро Юро)
            },
            {
              word: 'віпустив',
              suggestions:  %w(впустив випустив відпустив спустив упустив підпустив)
            },
            {
              word: 'собіку', suggestions: ['собаку']
            }
          ]
        end

        it { is_expected.to eq result }
      end

      context 'when invalid words' do
        context do
          let(:sentence) { 'Добрий векчір' }

          let(:result) do
            [{ word: 'векчір', suggestions: ['вечір'] }]
          end

          it { is_expected.to eq result }
        end

        context do
          let(:sentence) { 'Добриц вечір' }

          let(:result) do
            [{ word: 'Добриц', suggestions: %w(Добрий Добрих Добрию Добриє Добрив Добрим) }]
          end

          it { is_expected.to eq result }
        end
      end
    end
  end
end
