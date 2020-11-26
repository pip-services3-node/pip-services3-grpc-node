"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrpcClient = void 0;
/** @module clients */
/** @hidden */
let _ = require('lodash');
/** @hidden */
let querystring = require('querystring');
/** @hidden */
const fs = require('fs');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_components_node_2 = require("pip-services3-components-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
/**
 * Abstract client that calls remove endpoints using GRPC protocol.
 *
 * ### Configuration parameters ###
 *
 * - connection(s):
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.htmls IDiscovery]]
 *   - protocol:              connection protocol: http or https
 *   - host:                  host name or IP address
 *   - port:                  port number
 *   - uri:                   resource URI or connection string with all parameters in it
 * - options:
 *   - retries:               number of retries (default: 3)
 *   - connect_timeout:       connection timeout in milliseconds (default: 10 sec)
 *   - timeout:               invocation timeout in milliseconds (default: 10 sec)
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>         (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>         (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 *
 * @see [[GrpcService]]
 * @see [[CommandableHttpService]]
 *
 * ### Example ###
 *
 *     class MyGrpcClient extends GrpcClient implements IMyClient {
 *        ...
 *
 *        public getData(correlationId: string, id: string,
 *            callback: (err: any, result: MyData) => void): void {
 *
 *            let timing = this.instrument(correlationId, 'myclient.get_data');
 *            this.call("get_data", correlationId, { id: id }, (err, result) => {
 *                timing.endTiming();
 *                callback(err, result);
 *            });
 *        }
 *        ...
 *     }
 *
 *     let client = new MyGrpcClient();
 *     client.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *
 *     client.getData("123", "1", (err, result) => {
 *       ...
 *     });
 */
class GrpcClient {
    constructor(clientTypeOrPath, clientName, packageOptions) {
        /**
         * The connection resolver.
         */
        this._connectionResolver = new pip_services3_rpc_node_1.HttpConnectionResolver();
        /**
         * The logger.
         */
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        /**
         * The performance counters.
         */
        this._counters = new pip_services3_components_node_2.CompositeCounters();
        /**
         * The configuration options.
         */
        this._options = new pip_services3_commons_node_1.ConfigParams();
        /**
         * The connection timeout in milliseconds.
         */
        this._connectTimeout = 10000;
        /**
         * The invocation timeout in milliseconds.
         */
        this._timeout = 10000;
        this._clientType = !_.isString(clientTypeOrPath) ? clientTypeOrPath : null;
        this._protoPath = _.isString(clientTypeOrPath) ? clientTypeOrPath : null;
        this._clientName = clientName;
        this._packageOptions = packageOptions;
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        config = config.setDefaults(GrpcClient._defaultConfig);
        this._connectionResolver.configure(config);
        this._options = this._options.override(config.getSection("options"));
        this._connectTimeout = config.getAsIntegerWithDefault("options.connect_timeout", this._connectTimeout);
        this._timeout = config.getAsIntegerWithDefault("options.timeout", this._timeout);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._connectionResolver.setReferences(references);
    }
    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a Timing object that is used to end the time measurement.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param name              a method name.
     * @returns Timing object to end the time measurement.
     */
    instrument(correlationId, name) {
        this._logger.trace(correlationId, "Executing %s method", name);
        this._counters.incrementOne(name + ".call_count");
        return this._counters.beginTiming(name + ".call_time");
    }
    /**
     * Adds instrumentation to error handling.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param name              a method name.
     * @param err               an occured error
     * @param result            (optional) an execution result
     * @param callback          (optional) an execution callback
     */
    instrumentError(correlationId, name, err, result = null, callback = null) {
        if (err != null) {
            this._logger.error(correlationId, err, "Failed to call %s method", name);
            this._counters.incrementOne(name + '.call_errors');
        }
        if (callback)
            callback(err, result);
    }
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen() {
        return this._client != null;
    }
    /**
     * Opens the component.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    open(correlationId, callback) {
        if (this.isOpen()) {
            if (callback)
                callback(null);
            return;
        }
        this._connectionResolver.resolve(correlationId, (err, connection, credential) => {
            if (err) {
                if (callback)
                    callback(err);
                return;
            }
            this._uri = connection.getUri();
            try {
                let options = {};
                if (connection.getProtocol('http') == 'https') {
                    let sslKeyFile = credential.getAsNullableString('ssl_key_file');
                    let privateKey = fs.readFileSync(sslKeyFile).toString();
                    let sslCrtFile = credential.getAsNullableString('ssl_crt_file');
                    let certificate = fs.readFileSync(sslCrtFile).toString();
                    let ca = [];
                    let sslCaFile = credential.getAsNullableString('ssl_ca_file');
                    if (sslCaFile != null) {
                        let caText = fs.readFileSync(sslCaFile).toString();
                        while (caText != null && caText.trim().length > 0) {
                            let crtIndex = caText.lastIndexOf('-----BEGIN CERTIFICATE-----');
                            if (crtIndex > -1) {
                                ca.push(caText.substring(crtIndex));
                                caText = caText.substring(0, crtIndex);
                            }
                        }
                    }
                    options.kvpair = {
                        'private_key': privateKey,
                        'cert_chain': certificate
                    };
                    options.key = privateKey;
                    options.cert = certificate;
                    options.ca = ca;
                }
                // Create instance of express application   
                let grpc = require('grpc');
                let credentials = connection.getProtocol('http') == 'https'
                    ? grpc.credentials.createSsl(options.ca, options.key, options.cert)
                    : grpc.credentials.createInsecure();
                let clientType = this._clientType;
                // Dynamically load client type
                if (clientType == null) {
                    let protoLoader = require('@grpc/proto-loader');
                    let options = this._packageOptions || {
                        keepCase: true,
                        longs: Number,
                        enums: Number,
                        defaults: true,
                        oneofs: true
                    };
                    let packageDefinition = protoLoader.loadSync(this._protoPath, options);
                    let packageObject = grpc.loadPackageDefinition(packageDefinition);
                    clientType = this.getClientByName(packageObject, this._clientName);
                }
                // Statically load client type
                else {
                    clientType = this.getClientByName(this._clientType, this._clientName);
                }
                this._client = new clientType(connection.getHost() + ':' + connection.getPort(), credentials);
                if (callback)
                    callback(null);
            }
            catch (ex) {
                this._client = null;
                let err = new pip_services3_commons_node_2.ConnectionException(correlationId, "CANNOT_CONNECT", "Opening GRPC client failed")
                    .wrap(ex).withDetails("url", this._uri);
                if (callback)
                    callback(err);
            }
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    close(correlationId, callback) {
        if (this._client != null) {
            // Eat exceptions
            try {
                this._logger.debug(correlationId, "Closed GRPC service at %s", this._uri);
            }
            catch (ex) {
                this._logger.warn(correlationId, "Failed while closing GRPC service: %s", ex);
            }
            this._client = null;
            this._uri = null;
        }
        if (callback)
            callback(null);
    }
    getClientByName(packageObject, clientName) {
        if (packageObject == null || clientName == null)
            return packageObject;
        let names = clientName.split(".");
        for (let name of names) {
            packageObject = packageObject[name];
            if (packageObject == null)
                break;
        }
        return packageObject;
    }
    /**
     * Calls a remote method via GRPC protocol.
     *
     * @param method            a method name to called
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param request           (optional) request object.
     * @param callback          (optional) callback function that receives result object or error.
     */
    call(method, correlationId, request = {}, callback) {
        method = method.toLowerCase();
        if (_.isFunction(request)) {
            callback = request;
            request = {};
        }
        this._client[method](request, (err, response) => {
            if (callback)
                callback(err, response);
        });
    }
}
exports.GrpcClient = GrpcClient;
GrpcClient._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples("connection.protocol", "http", "connection.host", "0.0.0.0", "connection.port", 3000, "options.request_max_size", 1024 * 1024, "options.connect_timeout", 10000, "options.timeout", 10000, "options.retries", 3, "options.debug", true);
//# sourceMappingURL=GrpcClient.js.map