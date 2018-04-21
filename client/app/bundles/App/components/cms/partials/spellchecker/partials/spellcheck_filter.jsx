import React from 'react';
import {FormGroup, FormControl, InputGroup} from 'react-bootstrap';
import {Scrollbars} from 'react-custom-scrollbars';
import SpellCheckFilterItem from './spellcheck_filter_item';
import AddToDictionaryButton from "./add_to_dictionary_button";


export default class SpellCheckFilter extends AddToDictionaryButton {

  render() {
    const self = this;
    let trs = <tr>
      <td colSpan="2">Nothing in here yet.</td>
    </tr>

    if (self.getDictionaries().length) {
      trs = self.getDictionaries().map((word, idx) => {
        return (
          <tr key={idx}>
            <td className="width-90">
              <SpellCheckFilterItem dir={this.props.dir}
                                    word={word}
                                    index={idx}
                                    updateDictionary={self.updateDictionary.bind(this)}
                                    getDictionaries={self.getDictionaries.bind(this)} />
            </td>
            <td className="width-10 text-center">
              <a className="red-text"
                 href="javascript:void(0)"
                 onClick={ () => { self.removeToDictionary(idx) } }>
                <i className="fa fa-trash"></i>
              </a>
            </td>
          </tr>
        )
      });
     }

    return (
      <div className={ this.props.showPanel ? 'show' : 'hide' }>
        <p><i>Note: Whitelisted words are added to the dictionary used for this client's projects.</i></p>
        <Scrollbars autoHeight autoHeightMin={0} autoHeightMax={200}>
          <table className="table table-striped table-bordered table-hover">
            <tbody>
            {trs}
            </tbody>
          </table>
        </Scrollbars>
        <div className="m-t-10">
          <FormGroup>
            <InputGroup>
              <FormControl id="stringField" key={self.state.defaultKey} type="text" onChange={(e) => {
                self.setState({string: e.target.value})
              }} defaultValue={self.state.string} dir={this.props.dir} />
              <span className="input-group-btn" onClick={ self.addToDictionary.bind(this) }>
                <button className="btn btn-info btn-block"><i className="fa fa-plus"></i></button>
              </span>
            </InputGroup>
          </FormGroup>
        </div>
      </div>
    )
  }

}