import React, { Component } from 'react';
import Web3 from 'web3';
import { Network, Node, Edge } from 'react-vis-network';

import './Graph.css';

import ABI from "./contractAbis/Burner.abi.js"
let ADDRESS = '0xDec31651Bec1fBbFF392aa7DE956d6EE4559498b'

class Graph extends Component {
  constructor(props) {
    super(props);

    this.web3 = new Web3(new Web3.providers.HttpProvider('https://dai.poa.network'))

    this.state = {
      nodes: [],
      edges: []
    }

    this.fetchPastEvents()
  }

  fetchPastEvents() {
    let contract = new this.web3.eth.Contract(ABI, ADDRESS)
    let edges = []
    let nodeSet = new Set()

    let past = contract.getPastEvents('Transfer', {
      fromBlock: 0,
      toBlock: 'latest'
    })

    past.then(events => {
      events.forEach((event, i) => {
        // let { to, from, value } = event.returnValues
        let { to, from } = event.returnValues
        // console.log('to: ', to);
        // console.log('from: ', from);
        // console.log('value: ', value);

        nodeSet.add(to)
        nodeSet.add(from)

        //TODO: Add value here somehow
        edges.push(<Edge id={i} to={to} from={from} />);
      })

      let nodes = Array.from(nodeSet).map(id => {
        let label = id.substring(0,6)
        return <Node id={id} label={label} />;
      })


      this.setState({nodes, edges});
    })
  }

  myNetwork() {
    let network =  (
      <Network>
        {[
          ...this.state.nodes,
          ...this.state.edges
        ]}
      </Network>
    );

    return network
  }

  render() {
    return (
      <div>
        { this.myNetwork() }
      </div>
    )
  }
}

export default Graph;
