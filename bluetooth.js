var bleno = require('bleno');
var BlenoPrimaryService = bleno.PrimaryService;
var piWifi = require('pi-wifi')
var EchoCharacteristic = require('./characteristic');
var Characteristic = bleno.Characteristic;
var exec = require('child_process').exec;

var CHUNK_SIZE = 20;
var myId = '938e46ca-5b8a-11ea-bc55-0242ac130003';
var wifiBT =  '967e46ca-5b8b-12ea-ac55-0232ac131003'
var deviceName = 'iCoffee'
console.log('bleno - iCoffee');

var Descriptor = bleno.Descriptor;

var data = new Buffer('Send me some data to display');
var output = "";
var updateCallback;

var terminalCallback;
var terminalResponse;

var START_CHAR = String.fromCharCode(002); //START OF TEXT CHAR
var END_CHAR = String.fromCharCode(003);   //END OF TEXT CHAR


function sliceUpResponse(callback, responseText) {
  if (!responseText || !responseText.trim()) return;
  callback(new Buffer(START_CHAR));
  while(responseText !== '') {
      callback(new Buffer(responseText.substring(0, CHUNK_SIZE)));
      responseText = responseText.substring(CHUNK_SIZE);
  }
  callback(new Buffer(END_CHAR));
}

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising(deviceName, [myId]);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([
      new BlenoPrimaryService({
        uuid: myId,
        characteristics: [
            new bleno.Characteristic({
                uuid : wifiBT,
                properties : ['write','read','notify'],
                onReadRequest : function(offset, callback) {
                    console.log("Read request");
                    callback(bleno.Characteristic.RESULT_SUCCESS, new Buffer(terminalResponse).slice(offset));
                },
                onWriteRequest : function(newData, offset, withoutResponse, callback) {
                    if(offset) {
                        callback(bleno.Characteristic.RESULT_ATTR_NOT_LONG);
                    } else {
                        var data = newData.toString('utf8');
                        console.log("Command received: [" + data + "]");
			var network = JSON.parse(data)
			console.log(network)
			piWifi.connectTo(network, function(err) {
				if(!err){
					console.log('success')
			console.log(network['ssid'])
          //piWifi.connect(network['ssid'], network['password'], function(err){
            //if(err) {
              //console.log('error')
            //} else {
              //console.log('success')
            //}
          //})
                   		 }
                   		 else{
					console.log('error')
                   		 }
			})
                } },
                onSubscribe: function(maxValueSize, updateValueCallback) {
                   console.log("onSubscribe called");
                   terminalCallback = updateValueCallback;
                },
                onUnsubscribe: function() {
                    terminalCallback = null;
                    console.log("onUnsubscribe");
                }
            })
        ]
      })
    ]);
  }
});

bleno.on('accept', function(clientAddress) {
  console.log("Accepted connection from: " + clientAddress);
});

bleno.on('disconnect', function(clientAddress) {
  console.log("Disconnected from: " + clientAddress);
});   
