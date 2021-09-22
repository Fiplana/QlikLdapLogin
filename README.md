# QlikLdapLogin
In Qlik Sense (enterprise edition) you can add any LDAP server, to fetch it's users. You can assign licensens to them, and manage there access, etc.  
However it is not possible to perfom a login with these useres, if your LDAP server doesn't support Windows Authentication. Therefor we implemented a simple service, wich can be used as a Qlik Sense Virtual Proxy, to authenticate the LDAP Users against any LDAP Server.  
![](https://github.com/InformDataLab/.github/blob/main/images/QlikLdapLogin60Fps.gif)

# Installation (Windows)
Be sure that Node.js is installed on the Host that should run this service. You can download Node.js here: https://nodejs.org/en/ (we reccomand the LTS version). After installing node you can execute the ./install/install_windows.bat, which will install the service as a windows service.

# Installation (Linux)

Run the following commands: 
```
    npm install
    npm run build:prod
```
After running these commands, there should appear a dist directory. Pleas register a Node.js Service which executes the "./dist/index.js" file as a deamon service. (System example here: https://nodesource.com/blog/running-your-node-js-app-with-systemd-part-1/).  
The working directory of the service should be the root directory (NOT ./dist)! 

# Service configuration
To configure the service you must provide a ".env" file. After executing the installation you should rename the "sample.env" file to "./.env". Then you can configure the following parameters in it: 
| Variable                 | Description                                                                                                                                                             | Default Value                                              |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------|
| LDAP_HOST                | Name of the LDAP server                                                                                                                                                 | ldap.example.org                                           |
| LDAP_PORT                | Port where your LDAP server is listening on                                                                                                                             | 389                                                        |
| LDAP_SSL                 | Defines whether the traffic is encrypted or not. Please make sure that the service host trust the Certificate Authority, which signed the certs used by the LDAP server | false                                                      |
| QPS_URI                  | Address of the Qlik Sense Virtual Proxy  (will be configured in the next step.)                                                                                         | https://qlikserver.example.org:4243/qps/customVirtualProxy |
| QPS_CERTIFICATE_PATH     | Path to a client.pfx generated via qmc                                                                                                                                  | ./client.pfx                                               |
| QPS_CERTIFICATE_PASSOWRD | Password for the QPS_CERTIFICATE                                                                                                                                        | ""                                                         |
| HUB_URI                  | URL to the Qlik Sense HUB (with virtual proxy suffix)                                                                                                                   | https://qlikserver.example.org/hub/customVirtualProxy      |

Make sure that you restart the service after changing any of this env variables!!!

# Qlik Sense Virtual Proxy Configuration
