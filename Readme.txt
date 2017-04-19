Node on test network:

1. geth --testnet --fast --cache=512 console
2. geth --testnet --fast --cache=512 --rpc --rpccorsdomain --rpcapi "*" console
miner.start(2)

Coinbase Address: "0x78cd5933fe40f8744156d25df1b11c3c6c5563c3"
Command to check balance: eth.getBalance(eth.coinbase)

Node on main network:

geth --fast --cache=512 console

Setting up a private network

1. Write a genesis.json file
{
  "alloc"      : {},
  "coinbase"   : "0x0000000000000000000000000000000000000000",
  "difficulty" : "0x20000",
  "extraData"  : "",
  "gasLimit"   : "0x2fefd8",
  "nonce"      : "0x0000000000000042",
  "mixhash"    : "0x0000000000000000000000000000000000000000000000000000000000000000",
  "parentHash" : "0x0000000000000000000000000000000000000000000000000000000000000000",
  "timestamp"  : "0x00"
}

2. Pre-allocate funds to account if needed (optional)
"alloc": {
  "0x0000000000000000000000000000000000000001": {"balance": "111111111"},
  "0x0000000000000000000000000000000000000002": {"balance": "222222222"}
}

3. Initialize geth with genesis file
geth init path/to/genesis.json

4. On the other nodes copy the same genesis file and run the below bootnode commands to display an enode URL
bootnode --genkey=boot.key
bootnode --nodekey=boot.key

5. Run geth command from the admin node with the bootnode URLs. The full IP of the boot nodes should be used
geth --datadir=path/to/custom/data/folder --bootnodes=<bootnode-enode-url-from-above>

6. Optional mining on a private network
Mining on a private network: geth <usual-flags> --mine --minerthreads=1 --etherbase=0x0000000000000000000000000000000000000000


Sample Compiler Contract

var ballot_sol_apollotradeContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"rate","type":"uint256"}],"name":"setRate","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"kWh_rate","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"kwh","type":"uint256"}],"name":"sellEnergy","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"getEnergyAccount","outputs":[{"name":"kwh","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"getCoinAccount","outputs":[{"name":"coin","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"coin","type":"uint256"}],"name":"buyEnergy","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"}]);
var ballot_sol_apollotrade = ballot_sol_apollotradeContract.new(
   {
     from: web3.eth.accounts[1],
     data: '0x60606040526103e8600055341561001257fe5b5b33600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b610440806100656000396000f30060606040523615610081576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806334fcf4371461008357806338bc0053146100a35780634326ee36146100c95780634615f12c146100e95780635d17f66b1461010f5780638da5cb5b14610135578063bc8a251f14610187575bfe5b341561008b57fe5b6100a160048080359060200190919050506101a7565b005b34156100ab57fe5b6100b3610210565b6040518082815260200191505060405180910390f35b34156100d157fe5b6100e76004808035906020019091905050610216565b005b34156100f157fe5b6100f961026b565b6040518082815260200191505060405180910390f35b341561011757fe5b61011f6102b3565b6040518082815260200191505060405180910390f35b341561013d57fe5b6101456102fb565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561018f57fe5b6101a56004808035906020019091905050610321565b005b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156102045760006000fd5b806000819055505b5b50565b60005481565b6000548102600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b50565b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490505b90565b6000600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490505b90565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b80600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205411156104105780600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550600054818115156103c257fe5b04600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b5b505600a165627a7a72305820fd5e8e8a64cfb4549867a93e2c7bdee112605fbc9db7e4cfdf287e077c939c6b0029',
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 })

 [{"constant":false,"inputs":[{"name":"rate","type":"uint256"}],"name":"setRate","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"kWh_rate","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"kwh","type":"uint256"}],"name":"sellEnergy","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"getEnergyAccount","outputs":[{"name":"kwh","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"getCoinAccount","outputs":[{"name":"coin","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"coin","type":"uint256"}],"name":"buyEnergy","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"}]
