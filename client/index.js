const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');
const verifyProof = require('../utils/verifyProof');

const serverUrl = 'http://localhost:1225';

async function main() {
  // TODO: how do we prove to the server we're on the niceList? 
  // 1. create a merkle tree for the whole nice list
  const merkleTree = new MerkleTree(niceList);
  const root = merkleTree.getRoot();
  console.log({ root })
  
  // 2. find the proof that your name is in the list
  const name = 'Ruben Toy';
  const index = niceList.findIndex(n => n === name);
  const proof = merkleTree.getProof(index);

  // verify proof against the Merkle Root
  console.log({proof, name, root})
  console.log( verifyProof(proof, name, root) );

  // 3. send the proof to the server
  const { data: gift } = await axios.post(`${serverUrl}/gift`, {    
    proof,
    name,
    root
  });

  console.log({ gift });
}

main();