# List of components in a module with a list of parameters available for configuration via the configuration file.

### <a name="commandable_grpc_client"></a> CommandableGrpcClient
CommandableGrpcClient has the following configuration properties:
- *connection(s)*:           
    - *discovery_key*: (optional) a key to retrieve the   connection from [IDiscovery](https://rawgit.com/pip-services-node/pip-services-components-node/master/doc/api/interfaces/connect.idiscovery.html)
    - *protocol*: connection protocol: http or https
    - *host*: host name or IP address
    - *port*: port number
    - *uri*: resource URI or connection string with all parameters in it
- *options*:
    - *retries*: number of retries (default: 3)
    - *connect_timeout*: connection timeout in milliseconds   (default: 10 sec)
    - *timeout*: invocation timeout in milliseconds (default: 10 sec)     


### <a name="grpc_client"></a> GrpcClient
GrpcClient has the following configuration properties:
- *connection(s)*:           
  - *discovery_key*: (optional) a key to retrieve the connection from [IDiscovery](https://rawgit.com/pip-services-node/pip-services-components-node/master/doc/api/interfaces/connect.idiscovery.html)
  - *protocol*: connection protocol: http or https
  - *host*: host name or IP address
  - *port*: port number
  - *uri*: resource URI or connection string with all parameters in it
- *options*:
  - *retries*: number of retries (default: 3)
  - *connect_timeout*: connection timeout in milliseconds (default: 10 sec)
  - *timeout*: invocation timeout in milliseconds (default: 10 sec)


### <a name="сommandable_grpc_service"></a> CommandableGrpcService
CommandableGrpcService has the following configuration properties:
- *dependencies*:
    - *endpoint*: override for HTTP Endpoint   dependency
    - *controller*:  override for Controller dependency
- connection(s):           
    - *discovery_key*: (optional) a key to retrieve the     connection from [IDiscovery](https://rawgit.com/pip-services-node/pip-services-components-node/master/doc/api/interfaces/connect.idiscovery.html)
    - *protocol*: connection protocol: http or https
    - *host*: host name or IP address
    - *port*: port number
    - *uri*: resource URI or connection string with all parameters in it


### <a name="grpc_endpoint"></a> GrpcEndpoint
GrpcEndpoint has the following configuration properties:
- *connection(s)* - the connection resolver's connections:
    - *discovery_key*: the key to use for connection resolving in a discovery service;
    - *protocol*: the connection's protocol;
    - *host*: the target host;
    - *port*: the target port;
    - *uri*: the target URI.
- *credential* - the HTTPS credentials:
    - *ssl_key_file*: the SSL private key in PEM
    - *ssl_crt_file*: the SSL certificate in PEM
    - *ssl_ca_file*: the certificate authorities (root cerfiticates) in PEM

### <a name="grpc_service"></a> GrpcService
GrpcService has the following configuration properties:
- *dependencies*:
    - *endpoint*: override for GRPC Endpoint   dependency
    - *controller*: override for Controller dependency
- *connection(s)*:           
    - *discovery_key*: (optional) a key to retrieve the     connection from [IDiscovery](https://rawgit.com/pip-services-node/pip-services-components-node/master/doc/api/interfaces/connect.idiscovery.html)
    - *protocol*: connection protocol: http or https
    - *host*: host name or IP address
    - *port*: port number
    - *uri*: resource URI or connection string with all parameters in it
- *credential* - the HTTPS credentials:
    - *ssl_key_file*: the SSL private key in PEM
    - *ssl_crt_file*: the SSL certificate in PEM
    - *ssl_ca_file*: the certificate authorities (root cerfiticates) in PEM
  