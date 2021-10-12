# QlikLdapLogin
In Qlik Sense (enterprise edition) you can add any LDAP server, to fetch it's users. You can assign licensens to them, and manage there access, etc.  
However it is not possible to perfom a login with these useres, if your LDAP server doesn't support Windows Authentication. Therefore we implemented a simple service, wich can be used as a Qlik Sense Virtual Proxy, to authenticate the LDAP Users against any LDAP Server.  
![](https://github.com/InformDataLab/.github/blob/main/images/QlikLdapLogin60Fps.gif)

# LICENSE
All files in the directorys ```src``` and ```test``` are affected by the GNU GENERAL PUBLIC LICENSE Version 3. However, there are dependencies needed to build the service. All the dependencies can be found in the ```dependencies``` section of the file ```package.json```. All these external packages are currently licensed by the MIT license and not affected by the GNU GPL v3.

# Installation (Windows)
Be sure that Node.js is installed on the Host that should run this service. You can download Node.js here: https://nodejs.org/en/ (we recommend the LTS version). After installing node you can execute the ./install/install_windows.bat, which will install the service as a windows service.
Pay attention, the script will install additional packages wich are under teh MIT license.

# Installation (Linux)

Run the following commands: 
```
    npm install
    npm run build:prod
```
Pay attention: ``` npm install ``` will install additional packages wich are under teh MIT license.
After running these commands, there should appear a dist directory. Please register a Node.js service which executes the "./dist/index.js" file as a deamon service. (System example here: https://nodesource.com/blog/running-your-node-js-app-with-systemd-part-1/).  
The working directory of the service should be the root directory (NOT ./dist)! 

# Service configuration
To configure the service you must provide a "env.json" file. After executing the installation you should rename the "sample.env.json" file to "./env.json". Then you can configure the following keys in it: 
| Variable                 | Description                                                                                                                                                             | Default Value                                              |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------|
| CERT_FILE_PATH           | Path to a certificate (pem x509): Run this service under https instead of http (only works with KEY_FILE_PATH).                                                         | undefined                                                  |
| KEY_FILE_PATH            | Path to a key (pem x509): Run this service under https instead of http (only works with CERT_FILE_PATH).(PROVIDE A KEY WITHOUT PASSPHRASE)                              | undefined                                                  |
| SERVER_PORT              | Service port (this service).                                                                                                                                            | 9000                                                       |
| LDAP_HOST                | Name of the LDAP server                                                                                                                                                 | ldap.example.org                                           |
| LDAP_PORT                | Port where your LDAP server is listening on                                                                                                                             | 389                                                        |
| LDAP_SSL                 | Defines whether the traffic is encrypted or not. Please make sure that the service host trust the Certificate Authority, which signed the certs used by the LDAP server | false                                                      |
| QPS_URI                  | Address of the Qlik Sense Virtual Proxy  (will be configured in the next step.)                                                                                         | https://qlikserver.example.org:4243/qps/customVirtualProxy |
| QPS_CERTIFICATE_PATH     | Path to a client.pfx generated via qmc                                                                                                                                  | ./client.pfx                                               |
| QPS_CERTIFICATE_PASSOWRD | Password for the QPS_CERTIFICATE                                                                                                                                        | ""                                                         |
| HUB_URI                  | URL to the Qlik Sense HUB (with virtual proxy suffix)                                                                                                                   | https://qlikserver.example.org/customVirtualProxy/hub/     |

Make sure that you restart the service after changing any of this env variables!!!

# Qlik Sense Virtual Proxy Configuration
In the Qlik Management Console you have to provide a new virtual proxy. You got to provide the following fields in the new virtual proxy:  
 -  Session cookie header name: X-Qlik-SessionLdap
 - Authentication module redirect URI: Here you got to provide the address of this service (https://service:9000)
 - Host allow list: Register this service as an allowed host (service:9000)
 - Under "Associated items", click onto "Proxies" and register the Central Node Proxy
