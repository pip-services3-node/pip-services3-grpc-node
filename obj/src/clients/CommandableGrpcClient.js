"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @module clients */
const GrpcClient_1 = require("./GrpcClient");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
/**
 * Abstract client that calls commandable GRPC service.
 *
 * Commandable services are generated automatically for [[https://rawgit.com/pip-services-node/pip-services3-commons-node/master/doc/api/interfaces/commands.icommandable.html ICommandable objects]].
 * Each command is exposed as Invoke method that receives all parameters as args.
 *
 * ### Configuration parameters ###
 *
 * - connection(s):
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/interfaces/connect.idiscovery.html IDiscovery]]
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
 * - <code>\*:logger:\*:\*:1.0</code>         (optional) [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>         (optional) [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 *
 * ### Example ###
 *
 *     class MyCommandableGrpcClient extends CommandableGrpcClient implements IMyClient {
 *        ...
 *
 *         public getData(correlationId: string, id: string,
 *            callback: (err: any, result: MyData) => void): void {
 *
 *            this.callCommand(
 *                "get_data",
 *                correlationId,
 *                { id: id },
 *                (err, result) => {
 *                    callback(err, result);
 *                }
 *             );
 *         }
 *         ...
 *     }
 *
 *     let client = new MyCommandableGrpcClient();
 *     client.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *
 *     client.getData("123", "1", (err, result) => {
 *     ...
 *     });
 */
class CommandableGrpcClient extends GrpcClient_1.GrpcClient {
    /**
     * Creates a new instance of the client.
     *
     * @param name     a service name.
     */
    constructor(name) {
        super(__dirname + "../../../../src/protos/commandable.proto", "commandable.Commandable");
        this._name = name;
    }
    /**
     * Calls a remote method via GRPC commadable protocol.
     * The call is made via Invoke method and all parameters are sent in args object.
     * The complete route to remote method is defined as serviceName + "." + name.
     *
     * @param name              a name of the command to call.
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param params            command parameters.
     * @param callback          callback function that receives result or error.
     */
    callCommand(name, correlationId, params, callback) {
        let method = this._name + '.' + name;
        let timing = this.instrument(correlationId, method);
        let request = {
            method: method,
            correlation_id: correlationId,
            args_empty: params == null,
            args_json: params != null ? JSON.stringify(params) : null
        };
        this.call("invoke", correlationId, request, (err, response) => {
            timing.endTiming();
            // Handle unexpected error
            if (err) {
                this.instrumentError(correlationId, method, err);
                if (callback)
                    callback(err, null);
                return;
            }
            // Handle error response
            if (response.error != null) {
                let err = pip_services3_commons_node_1.ApplicationExceptionFactory.create(response.error);
                if (callback)
                    callback(err, null);
                return;
            }
            // Handle empty response
            if (response.result_empty || response.result_json == null) {
                if (callback)
                    callback(null, null);
                return;
            }
            // Handle regular response
            try {
                let result = JSON.parse(response.result_json);
                if (callback)
                    callback(null, result);
            }
            catch (ex) {
                if (callback)
                    callback(ex, null);
            }
        });
    }
}
exports.CommandableGrpcClient = CommandableGrpcClient;
//# sourceMappingURL=CommandableGrpcClient.js.map