# mqtt-bridge

This fully configurable MQTT bridge subscribes to MQTT broker for defined topic and streams messages published to that topic to dynamically defined backends. The configured backends subscribe to simple `data` and `flush` events which give them access to the message `topic` and `content` whenever new messages for the defined topic arrive. 

Supported backends:

* Console (default)
* Redis
* statsd
* RethinkDB
* TempoDB (alpha)
* Graphite
* Xively 

> New backends will be added, if you don't see what you need, contribute. 

## Configuration

The app includes a sample configuration file: `config-sample.json`. Simply rename that file to `config.json` and edit the portent elements:
    
### MQTT

If your broker does not require secure client, simply switch the `secure` and remove the no longer needed elements from the `args`: `keyPath`, `certPath`. If no authentication is required you can further remove the `username` and `password` arguments. For each one of these use-cases, the MQTT broker will also need require a different port.

	"mqtt": {
		"secure": true,
		"topic": "#",
		"host": "mqtt.mydomain.com",
		"port": 8884,
		"args": {
			"clientId": "mqtt-bridge",
			"keyPath": "./certs/client.key",
			"certPath": "./certs/client.crt",
			"username": "sampleuser",
			"password": "samplepassword",
			"keepalive": 59000
		}
	}

### Backends

For each backend, you must define two arguments: `handler` with the implementation file (probably located in the backends directory) and the `config` arguments for that backend. These will be anything the backend requires.

    "backends": [
    
    	{
			"handler": "./backends/some-backend.js",
			"config": {
				"arg": "val"
			}
    	}
    
    ]
    
> Remember, some backends require additional installation before the initial run.

#### Xively Backend

Posts all mqtt messages to Xively feed, automatically creates datastreams for all mqtt topics processed.
Transforms mqtt topic to Xively datastream name.
Optionally transforms mqtt message to datastream value using JSONPath - to be used if messages are JSON data.

Requires node-rest-client

    $ npm install node-rest-client

Optionally reqieres JSONPath if jsonpath config is used

    $ npm install JSONPath


##### Configuration

	"backends": [
	
		{
			"handler": "./backends/xively-backend.js",
			"config": {
				"feed": "YOUR_FEED_ID_HERE",  
				"apikey": "YOUR_FEED_KEY_HERE",
				"jsonpath": "$.value'

			}
		}
		
	]

The jsonpath config assumes the mqtt messages are json data such as {"value":3,"unit": "Celsius"} and you want to post to xively only its value. If message is plain text, jsonpath config has to be ommited.

### Logging

To change the verbosity of console logging, you can alter the `level` argument. See `winston` documentation for `mqtt-bridge` supported levels (debug, info, warn, error).

    "log": {
		"level": "debug",
		"timestamp": true
    }


## Installation

    $ npm install mqtt-mqtt-bridge
    
## Standalone Usage

To run the `mqtt-bridge` as a standalone app, simply use the provided `start-bridge.sh` scripts which will provision `forever` to assure continuous uptime. 

    $ ./start-bridge.sh
    
To stop the service either the `stop` command in `forever` or simply execute the provided script

    $ ./stop-bridge.sh

## Contribute

Contributions, new/improved backbends or otherwise, are welcomed:

* Fork the project
* Improve (comments would be nice)
* Commit to your repo
* Issue a pull request in github's web interface



