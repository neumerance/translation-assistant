import React from 'react';
import WebtaSpellcheckerUserDictionary from '../../adapters/webta_spellchecker/user_dictionary';

export default class WebtaSpellcheckerUserDictionaryTable extends React.Component {

  constructor(props) {
    super(props);
    this.userDictionary = new WebtaSpellcheckerUserDictionary(this.props.lang);
    this.state = {
      dictionary: this.userDictionary.getDictionary()
    }
  }

  renderRows() {
    return this.userDictionary.getDictionary().map((x, idx) => {
      return(
        <tr key={idx}>
          <td>{x}</td>
          <td>
            <button className="btn btn-default btn-xs" onClick={() => {
              this.userDictionary.removeFromDictionary(x)
              this.setState({ dictionary: this.userDictionary.getDictionary() })
            }}>Remove</button>
          </td>
        </tr>
      )
    });
  }

  render() {
    return(
      <table className={`table table-slim table-striped vertical-middle-table`}>
        <thead>
          <tr>
            <th>Whitelisted words</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    );
  }

}