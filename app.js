var express = require('express');
var bodyParser = require('body-parser');
var request = require("request");
var SolidityCoder = require("web3/lib/solidity/coder.js");
var Web3 = require("web3");
var app = express();
var abiArray = [{"constant":false,"inputs":[{"name":"rate","type":"uint256"}],"name":"setRate","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"kWh_rate","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"kwh","type":"uint256"}],"name":"sellEnergy","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"getEnergyAccount","outputs":[{"name":"kwh","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"getCoinAccount","outputs":[{"name":"coin","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"coin","type":"uint256"}],"name":"buyEnergy","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"}]
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
var account = '0x6ba607ef60192dec4512d2a12689672fc51a3dfe'; // Dev
var contractAddress = '0x46ed87eb9c4a80384ada78d3feaa351655bd5c3c';
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var functionHashes = getFunctionHashes(abiArray);
var contract = web3.eth.contract(abiArray).at(contractAddress);
web3.eth.defaultAccount = account;

// Assemble function hashes

app.get('/dataRecords', function (req, res) {
  var balanceWei = web3.eth.getBalance(account).toNumber();
  var balance = web3.fromWei(balanceWei, 'ether');
  console.log(balanceWei);
  console.log(balance);
});

app.post('/buy', function (req, res) {
  //buyText
  var buyText = req.body.buyText;
  contract.buyEnergy(Number(buyText));

});

app.post('/sell', function (req, res) {
  //sellText
  var sellText = req.body.sellText;
  contract.sellEnergy(Number(sellText));

});

app.get('/getCoinBalance', function (req, res) {
  var coinBalance = contract.getCoinAccount.call();
  res.send(coinBalance);
});

app.get('/getEnergyBalance', function (req, res) {
  var energyBalance = contract.getEnergyAccount.call();
  res.send(energyBalance);
});

app.get('/transactions', function (req, res) {
  var filter = web3.eth.filter('latest');
  filter.watch(function(error, result){
    if (error) return;
    var block = web3.eth.getBlock(result, true);
    console.log(block.transactions.length);
    if(block.transactions.length == 0){
      res.end('<tr><td>' + '-' +  '</td><td>' + '-' + '</td><td>' + "ApolloTrade" +'</td><td>sellEnergy(' + '-' + ')</td></tr>');
    }else{
      for (var index = 0; index < block.transactions.length; index++) {
        var t = block.transactions[index];
        // Decode from
        var from = t.from==account ? "me" : t.from;
        // Decode function
        var func = findFunctionByHash(functionHashes, t.input);
        if (func == 'sellEnergy') {
          // This is the sellEnergy() method
          var inputData = SolidityCoder.decodeParams(["uint256"], t.input.substring(10));
        //  console.dir(inputData);
          // $('#transactions').append('<tr><td>' + t.blockNumber +
          //   '</td><td>' + from +
          //   '</td><td>' + "ApolloTrade" +
          //   '</td><td>sellEnergy(' + inputData[0].toString() + ')</td></tr>');
          res.end('<tr><td>' + t.blockNumber +  '</td><td>' + from + '</td><td>' + "ApolloTrade" +'</td><td>sellEnergy(' + inputData[0].toString() + ')</td></tr>');
        } else if (func == 'buyEnergy') {
          // This is the buyEnergy() method
          var inputData = SolidityCoder.decodeParams(["uint256"], t.input.substring(10));
      //    console.dir(inputData);
          // $('#transactions').append('<tr><td>' + t.blockNumber +
          //   '</td><td>' + from +
          //   '</td><td>' + "ApolloTrade" +
          //   '</td><td>buyEnergy(' + inputData[0].toString() + ')</td></tr>');
          res.end('<tr><td>' + t.blockNumber + '</td><td>' + from + '</td><td>' + "ApolloTrade" + '</td><td>buyEnergy(' + inputData[0].toString() + ')</td></tr>');
        } else {
          // Default log
          //$('#transactions').append('<tr><td>' + t.blockNumber + '</td><td>' + from + '</td><td>' + t.to + '</td><td>' + t.input + '</td></tr>')
          res.end('<tr><td>' + t.blockNumber + '</td><td>' + from + '</td><td>' + t.to + '</td><td>' + t.input + '</td></tr>');
        }
      }
    }
  });
});
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});

app.get('/',function(req,res){
	res.sendFile(__dirname + "/index.html");
});
app.listen('3000', function(){
  console.log('running on 3000...');
  //transactionWatch();
});



function getFunctionHashes(abi) {
  var hashes = [];
  for (var i=0; i<abi.length; i++) {
    var item = abi[i];
    if (item.type != "function") continue;
    var signature = item.name + "(" + item.inputs.map(function(input) {return input.type;}).join(",") + ")";
    var hash = web3.sha3(signature);
    //console.log(item.name + '=' + hash);
    hashes.push({name: item.name, hash: hash});
  }
  return hashes;
}

function findFunctionByHash(hashes, functionHash) {
  for (var i=0; i<hashes.length; i++) {
    if (hashes[i].hash.substring(0, 10) == functionHash.substring(0, 10))
      return hashes[i].name;
  }
  return null;
}

function transactionWatch(){
  var filter = web3.eth.filter('latest');
  filter.watch(function(error, result){
    if (error) return;
    var block = web3.eth.getBlock(result, true);
    console.log('block #' + block.number);
    console.dir(block.transactions);
    for (var index = 0; index < block.transactions.length; index++) {
      var t = block.transactions[index];
      // Decode from
      var from = t.from==account ? "me" : t.from;
      // Decode function
      var func = findFunctionByHash(functionHashes, t.input);
      if (func == 'sellEnergy') {
        // This is the sellEnergy() method
        var inputData = SolidityCoder.decodeParams(["uint256"], t.input.substring(10));
        console.dir(inputData);
        // $('#transactions').append('<tr><td>' + t.blockNumber +
        //   '</td><td>' + from +
        //   '</td><td>' + "ApolloTrade" +
        //   '</td><td>sellEnergy(' + inputData[0].toString() + ')</td></tr>');
      } else if (func == 'buyEnergy') {
        // This is the buyEnergy() method
        var inputData = SolidityCoder.decodeParams(["uint256"], t.input.substring(10));
        console.dir(inputData);
        // $('#transactions').append('<tr><td>' + t.blockNumber +
        //   '</td><td>' + from +
        //   '</td><td>' + "ApolloTrade" +
        //   '</td><td>buyEnergy(' + inputData[0].toString() + ')</td></tr>');
      } else {
        // Default log
        //$('#transactions').append('<tr><td>' + t.blockNumber + '</td><td>' + from + '</td><td>' + t.to + '</td><td>' + t.input + '</td></tr>')
      }
    }
  });
}
