import React, { Component, createRef } from 'react';
import vis from '../node_modules/vis/dist/vis'

import '../node_modules/vis/dist/vis.css';


class Network extends Component {
  constructor(props) {
    super(props)

    this.ref = createRef()
  }

  initNetwork() {
    // var nodes = new vis.DataSet([
    //   {id: '0x4773722bf82639fB6145A8dBd088041618ECf4f6', label: '0x4773'},
    //   {id: '0x34aA3F359A9D614239015126635CE7732c18fDF3', label: '0x34aA'},
    // ]);
    //
    // var edges = new vis.DataSet([
    //   {from: '0x34aA3F359A9D614239015126635CE7732c18fDF3', to: '0x4773722bf82639fB6145A8dBd088041618ECf4f6'},
    // ])

    console.log("In init Network")
    let nodes = new vis.DataSet(this.props.nodes)
    let edges = new vis.DataSet(this.props.edges)

    // provide the data in the vis format
    var data = {
      nodes: nodes,
      edges: edges
    };

    console.log('data: ', data);

    var options = {};

    var network = new vis.Network(this.ref.current, data, options);
    console.log('network: ', network);
  }

  render() {
    return (
      <div ref={this.ref} />
    );
  }
}

export default Network;
