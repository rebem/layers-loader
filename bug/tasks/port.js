const host = '127.0.0.1';

export default ({ minPort, maxPort }, callback) => input => {
    return function findPort(log) {
        const portscanner = require('portscanner');

        return new Promise(function(resolve, reject) {
            portscanner.findAPortNotInUse(minPort, maxPort, host, function(error, port) {
                if (error) {
                    return reject(error);
                }

                log(`found free port: ${port}`);
                callback(port);
            });
        });
    };
};
