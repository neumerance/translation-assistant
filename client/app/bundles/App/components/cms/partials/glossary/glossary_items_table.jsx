import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import GlossaryItemEditableRow from './glossary_item_editable_row';
import * as _ from 'lodash';
import NewGlossaryItem from './new_glossary_item'

export default class GlossaryItemsTable extends Component {

  rows() {
    const self = this;

    if (_.isEmpty(self.props.glossaryItems)) {
      return <tr><td colSpan="3"></td></tr>
    }

    return self.props.glossaryItems.map((glossaryItem, _idx) => {
      return(
        <GlossaryItemEditableRow app={ self.props.app }
                                 cmsData={self.props.cmsData}
                                 glossaryItem={ glossaryItem }
                                 key={ glossaryItem.id } id={ glossaryItem.id }/>
      );
    });
  }

  saveCallback() {
    const self = this;
    self.setState({showNewForm: false});
    self.props.toggleSaveDispatch();
  }

  render() {
    const self = this;
    const cmsData = self.props.cmsData;
    const originalLanguage = _.get(cmsData, 'source_language.name','');
    const targetLanguage = _.get(cmsData, 'target_language.name','');

    return(
      <div>
        <Scrollbars autoHeight autoHeightMin={0} autoHeightMax={400}>
          <table className="table table-slim table-striped vertical-middle-table">
            <thead>
            <tr>
              <th className="width-25">{ originalLanguage }</th>
              <th className="width-25">{ targetLanguage }</th>
              <th className="width-40"> Description </th>
              <th className="width-10">
                <button className={`btn btn-success pull-right ${self.props.showNewForm ? 'hide' : 'show'}`} onClick={() => {self.props.toggleNewForm()}}>Add New</button>
              </th>
            </tr>
            </thead>
          </table>
          <Scrollbars autoHide
                      autoHeight
                      autoHeightMin={200}
                      autoHeightMax={500}>
            <table className="table table-slim table-striped vertical-middle-table">
              <tbody>
              <NewGlossaryItem app={ self.props.app }
                               dispatchSave={self.props.dispatchSave}
                               dispatchCancel={self.props.dispatchCancel}
                               toggleSaveDispatch={self.saveCallback.bind(this)}
                               showNewForm={self.props.showNewForm}
                               toggleNewForm={self.props.toggleNewForm} />
              { self.rows() }
              </tbody>
            </table>
          </Scrollbars>
        </Scrollbars>
      </div>
    )
  }
}
