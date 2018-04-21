require 'rails_helper'

describe MachineTranslations::MicrosoftTranslator::Client do
  let(:from_lang) { 'en' }
  let(:to_lang) { 'uk' }
  let(:client) { described_class.new(from_lang: from_lang, to_lang: to_lang) }

  describe '#translate' do
    let(:text) { 'my word' }
    subject { client.translate(text: text) }

    before do
      FakeWeb.register_uri(
        :get, 'https://api.microsofttranslator.com/V2/Http.svc/Translate?from=en&to=uk&text=my+word',
        body: '<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">моє слово</string>'
      )

      allow(MachineTranslations::Caching::Driver).to receive(:best_connected_driver) do
        MachineTranslations::Caching::Driver.get(:in_memory)
      end
    end

    it do
      is_expected.to eq 'моє слово'
    end
  end
end
