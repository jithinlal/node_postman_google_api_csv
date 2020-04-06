const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'})); 


let stream = fs.createWriteStream("./output.csv", {flags:'a'});

app.post('/write', function(req, res) {
	const {id, name} = req.body;
	const data = JSON.parse(req.body.launchData);
	let result = {};
	let location = {};
	let output = [];

	if (data.results.length !== 0) {
		result = data.results[0];
		location = result.geometry.location;				
		output.push(result.name.split(',').join(' '));
		output.push(result.formatted_address.split(',').join(' - '))
		output.push(location.lat);
		output.push(location.lng);
	}
	
    let newLine = [];
    newLine.push(id);
    newLine.push(name.split(',').join(' '));
    newLine.push(output);

    stream.write(newLine.join(', ') + '\n')
    res.status(200).send('Saved to file');

});

var port = 3000;
app.listen(port);
console.log('Express started on port %d ...', port);