const fs = require('fs')
let Web3 = require('web3')
var net = require('net');

let abi = JSON.parse(fs.readFileSync('Burner.abi', 'utf8'))
let address = '0x94819805310cf736198df0de856b0ff5584f0903'
let ipc = "/Users/dbe/Library/Application Support/io.parity.ethereum/jsonrpc.ipc"
let web3 = new Web3(new Web3.providers.IpcProvider(ipc, net))
// let web3 = new Web3(new Web3.providers.HttpProvider('https://dai.poa.network'))

let contract = new web3.eth.Contract(abi, address)


let transfers = []
let nodes = {}

contract.getPastEvents('Transfer', {
  fromBlock: 0,
  toBlock: 'latest'
})
.then(events => {
  events.forEach(event => {
    let { to, from, value } = event.returnValues
    // console.log('to: ', to);
    // console.log('from: ', from);
    // console.log('value: ', value);

    nodes[to] = true
    nodes[from] = true

    transfers.push({
      to,
      from,
      value
    })
  })

  // console.log('transfers: ', transfers);
  // console.log('nodes: ', nodes);
  printNodes(nodes)
  printEdges(transfers)



})

function printNodes(nodes) {
  let nodeAddrs = Object.keys(nodes)
  console.log("var nodes = new vis.DataSet([")
  for(let i = 0; i < nodeAddrs.length; i++) {
    console.log(`{id: '${nodeAddrs[i]}', label: '${nodeAddrs[i].substring(0,6)}'},`)
  }
  console.log("]);")
}

function printEdges(transfers) {
  console.log("var edges = new vis.DataSet([")
  for(let i = 0; i < transfers.length; i++) {
    console.log(`{from: '${transfers[i].from}', to: '${transfers[i].to}'},`)
  }
  console.log("]);")
}
