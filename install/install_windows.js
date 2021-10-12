const Service = require('node-windows').Service;
// Create a new service object
var svc = new Service({
    name: 'QlikLdapLoginService',
    description: 'A auth service for qlik sense enterprise',
    script: __dirname + "\\..\\dist\\index.js",
    workingDirectory: __dirname + "\\..",
});
svc.on('install', function () {
    svc.start();
});
svc.on('alreadyinstalled', function () {
    svc.start();
});
svc.install();
