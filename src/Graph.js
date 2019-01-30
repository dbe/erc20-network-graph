import vis from 'vis';
import React, { Component } from 'react';
import Web3 from 'web3';

import './Graph.css';

import ABI from "./contractAbis/Burner.abi.js"
// let ADDRESS = '0xDec31651Bec1fBbFF392aa7DE956d6EE4559498b'
let ADDRESS = '0xA95D505E6933cB790ED3431805871EfE4E6BbafD'

class Graph extends Component {
  constructor(props) {
    super(props);

    this.web3 = new Web3(new Web3.providers.HttpProvider('https://dai.poa.network'))

    this.fetchPastEvents().then(data => {
      console.log('data: ', data);
      let div = document.getElementById('network')
      let network = new vis.Network(div, data, {});
    });
  }

  fetchPastEvents() {
    let contract = new this.web3.eth.Contract(ABI, ADDRESS)
    let edges = []
    let nodeSet = new Set()

    let past = contract.getPastEvents('Transfer', {
      fromBlock: 'earliest',
      toBlock: 'latest'
    })

    return past.then(events => {
      console.log('events: ', events);
      events.forEach((event, i) => {
        let { to, from, value } = event.returnValues
        nodeSet.add(to)
        nodeSet.add(from)

        edges.push({to, from, value});
      })

      let nodes = new vis.DataSet(
        Array.from(nodeSet).map(id => {
          let label = id.substring(0,6)
          return {id, label};
        })
      );

      edges = new vis.DataSet(edges)

      console.log('nodes: ', nodes);
      console.log('edges: ', edges);

      return {
        nodes,
        edges
      }
    }).catch(e => {
      console.log('e: ', e);
    })
  }

  render() {
    return (
      <div id="network">
      </div>
    )
  }
}

export default Graph;
