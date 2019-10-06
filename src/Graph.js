import vis from 'vis';
import React, { Component } from 'react';
import Web3 from 'web3';

import './Graph.css';

import ABI from "./contractAbis/ERC20Vendable.abi.js"
// let ADDRESS = '0xDec31651Bec1fBbFF392aa7DE956d6EE4559498b' //BURN v1
// let ADDRESS = '0xA95D505E6933cB790ED3431805871EfE4E6BbafD' //BURN v2
// let ADDRESS = '0x3e50bf6703fc132a94e4baff068db2055655f11b' //Buffidai
let ADDRESS = '0xdac17f958d2ee523a2206206994597c13d831ec7' //Tether Mainnet

class Graph extends Component {
  constructor(props) {
    super(props);

    // this.web3 = new Web3(new Web3.providers.HttpProvider('https://dai.poa.network'))
    this.web3 = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/f1f48e4d6201410c954df4c1a986ca9d'))

    this.fetchPastEvents().then(data => {
      let div = document.getElementById('network')
      let network = new vis.Network(div, data, {
        layout: {
          improvedLayout: false
        },
        physics: {
          stabilization: false
        }
      });
    });
  }

  fetchPastEvents() {
    let contract = new this.web3.eth.Contract(ABI, ADDRESS)
    let edges = []
    let nodeSet = new Set()

    // console.log("In fetch past")
    //
    // let emitter = contract.events.Transfer({
    //   fromBlock: 'earliest',
    //   toBlock: 'latest'
    // }, (error, event) => {
    //   console.log('error: ', error);
    //   console.log('event: ', event);
    // })
    //
    // console.log('emitter: ', emitter);
    //
    // emitter.on('data', (data) => {
    //   console.log('data: ', data);
    // })
    //
    // emitter.on('changed', (event) => {
    //   console.log('changed event: ', event);
    // })
    //
    // emitter.on('error', console.error)

    let past = this.web3.eth.getBlockNumber().then(block => {
      return contract.getPastEvents('Transfer', {
        fromBlock: block - 100,
        toBlock: 'latest'
      })

    })


    return past.then(events => {
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
        Loading
      </div>
    )
  }
}

export default Graph;
