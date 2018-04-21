import React from 'react';

export default class OtgsWebtaEditor extends React.Component {
  componentDidMount() {
    this.props.controller.prepare({
      dbId: this.props.dbid,
      shortcutsOptions: {
        colorSelectionData: this.props.colorSelectionData,
        xtagTokenData: this.props.xtagTokenData
      }
    });
  }

  render() {
    const self = this;
    return(
      <div id={this.props.controller.outerDom.editorCssId}
        className="otgs-webta-editor"
        dangerouslySetInnerHTML={{__html: self.props.originalString}}
      />
    )
  }
}
