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
The QlikLdapLogin service is from now on referred to as 'the service'.
In the Qlik Management Console (QMC) you have to provide a new virtual proxy. Enter the QMC under https://yourQlikUrl/qmc.

1) Navigate to <i>ConfigureSystem</i>-><i>Virtual</i> proxies. There
 - Create a new one and provide the following fields:
    - Session cookie header name: X-Qlik-SessionLdap
    - Prefix: customVirtualProxy (see Service Configuration Variables)
    - Authentication module redirect URI: Provide the address of the service (https://yourQlikLdapURL:9000)
    - Host allow list: 
        - Register the service (i.e. the QlikLdapLogin-Service)
        -   yourQlikLdapURL
        -   yourQlikLdapURL:9000
    - On the righthand side, click <b>Associated items</b>, then click <b>Proxies</b>
        - Register the Central Node Proxy

2) Navigate to <i>User directory connectors</i>, click <b>Create new</b>
 - Provide the following fields:
    - <i>Connection</i>
        - Name: <i>yourConnectorName</i>
        - Path: Path to LDAP (e.g. ldap://yourLDAPURL/dc=SOMETHING,dc=SOMETHINGELSE)
        - User Name: Your LDAP username (e.g. cn=admin,dc=SOMETHINGb,dc=SOMETHINGELSE)
        - Password: Your LDAP password
    - <i>Directory Entry Attributes</i>
        - Your entry attributes ... 

3) Navigate to <i>Manage Resources</i>-><i>Security rules</i>, add a rule
 - Provide the following fields:
    - Name: yourName
    - Description: yourDescription
    - Basic->Actions: Select <i>Duplicate</i>
    - Below Actions, provide user filter that uses the configured connector, e.g. user -> userDirectory, value -> <i>yourConnectorName</i>
This step allows the LDAP connector's users to use Qlik.

4) If you want your LDAP users to use data connections, repeat step 3) for data connection-specific security rules. For that 
 - Navigate to <i>Manage Content</i>-><i>Data connections</i>
 - Double click the data connection you want to change
 - Click <i>Associated items</i>-><i>Security rules</i>-><i>Create associated rule</i>
 - Add rule that allows <i>read</i> access to LDAP users (or any broader group)

5) Navigate to <i>Manage Resources</i>-><i>License management</i>-><i>User access rules</i> ( or <i>Manage Resources</i>-><i>License management</i>-><i>Professional access rules</i>, depending on qmc Version), click <b>Create new</b>
 - Name: YourName
 - Description: YourDescription
 - Basic
    - Allow access to user directory <i>yourConnectorName</i>
 - Click <b>Apply</b>

Done. Qlik should now allow access to all LDAP users.


