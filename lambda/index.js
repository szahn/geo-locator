var maps = require('@google/maps');

const googleMapsClient = maps.createClient({
    key: process.env.GOOGLE_API_KEY
});

exports.handler = (event, context, callback) => {

    const address = event.address || event.queryStringParameters.address;
    console.log(`Address is ${address}`);

    googleMapsClient.geocode({ address: address }, function(err, response) {

            if (err) {
                callback(err);   
                return;             
            }

            const [firstOrDefault] = response.json.results;
            const {geometry, formatted_address} = firstOrDefault;
            const {location} = geometry;
            const {lat, lng} = location;

            const callbackResponse = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin' : '*',
                    'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Credentials' : true,
                    'Content-Type': 'application/json'
                },
                /*Results should be JSON compatible*/
                body: JSON.stringify({lat: lat.toString(), long: lng.toString(), address: formatted_address})
            };

            callback(null, callbackResponse);
    
        }
    );

};