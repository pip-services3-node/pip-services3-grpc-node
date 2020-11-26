import { IOpenable } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { Parameters } from 'pip-services3-commons-node';
import { Schema } from 'pip-services3-commons-node';
import { IRegisterable } from './IRegisterable';
/**
 * Used for creating GRPC endpoints. An endpoint is a URL, at which a given service can be accessed by a client.
 *
 * ### Configuration parameters ###
 *
 * Parameters to pass to the [[configure]] method for component configuration:
 *
 * - connection(s) - the connection resolver's connections:
 *     - "connection.discovery_key" - the key to use for connection resolving in a discovery service;
 *     - "connection.protocol" - the connection's protocol;
 *     - "connection.host" - the target host;
 *     - "connection.port" - the target port;
 *     - "connection.uri" - the target URI.
 * - credential - the HTTPS credentials:
 *     - "credential.ssl_key_file" - the SSL private key in PEM
 *     - "credential.ssl_crt_file" - the SSL certificate in PEM
 *     - "credential.ssl_ca_file" - the certificate authorities (root cerfiticates) in PEM
 *
 * ### References ###
 *
 * A logger, counters, and a connection resolver can be referenced by passing the
 * following references to the object's [[setReferences]] method:
 *
 * - logger: <code>"\*:logger:\*:\*:1.0"</code>;
 * - counters: <code>"\*:counters:\*:\*:1.0"</code>;
 * - discovery: <code>"\*:discovery:\*:\*:1.0"</code> (for the connection resolver).
 *
 * ### Examples ###
 *
 *     public MyMethod(_config: ConfigParams, _references: IReferences) {
 *         let endpoint = new HttpEndpoint();
 *         if (this._config)
 *             endpoint.configure(this._config);
 *         if (this._references)
 *             endpoint.setReferences(this._references);
 *         ...
 *
 *         this._endpoint.open(correlationId, (err) => {
 *                 this._opened = err == null;
 *                 callback(err);
 *             });
 *         ...
 *     }
 */
export declare class GrpcEndpoint implements IOpenable, IConfigurable, IReferenceable {
    private static readonly _defaultConfig;
    private _server;
    private _connectionResolver;
    private _logger;
    private _counters;
    private _maintenanceEnabled;
    private _fileMaxSize;
    private _uri;
    private _registrations;
    private _commandableMethods;
    private _commandableSchemas;
    private _commandableService;
    /**
     * Configures this HttpEndpoint using the given configuration parameters.
     *
     * __Configuration parameters:__
     * - __connection(s)__ - the connection resolver's connections;
     *     - "connection.discovery_key" - the key to use for connection resolving in a discovery service;
     *     - "connection.protocol" - the connection's protocol;
     *     - "connection.host" - the target host;
     *     - "connection.port" - the target port;
     *     - "connection.uri" - the target URI.
     *     - "credential.ssl_key_file" - SSL private key in PEM
     *     - "credential.ssl_crt_file" - SSL certificate in PEM
     *     - "credential.ssl_ca_file" - Certificate authority (root certificate) in PEM
     *
     * @param config    configuration parameters, containing a "connection(s)" section.
     *
     * @see [[https://pip-services3-node.github.io/pip-services3-commons-node/classes/config.configparams.html ConfigParams]] (in the PipServices "Commons" package)
     */
    configure(config: ConfigParams): void;
    /**
     * Sets references to this endpoint's logger, counters, and connection resolver.
     *
     * __References:__
     * - logger: <code>"\*:logger:\*:\*:1.0"</code>
     * - counters: <code>"\*:counters:\*:\*:1.0"</code>
     * - discovery: <code>"\*:discovery:\*:\*:1.0"</code> (for the connection resolver)
     *
     * @param references    an IReferences object, containing references to a logger, counters,
     *                      and a connection resolver.
     *
     * @see [[https://pip-services3-node.github.io/pip-services3-commons-node/interfaces/refer.ireferences.html IReferences]] (in the PipServices "Commons" package)
     */
    setReferences(references: IReferences): void;
    /**
     * @returns whether or not this endpoint is open with an actively listening GRPC server.
     */
    isOpen(): boolean;
    /**
     * Opens a connection using the parameters resolved by the referenced connection
     * resolver and creates a GRPC server (service) using the set options and parameters.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param callback          (optional) the function to call once the opening process is complete.
     *                          Will be called with an error if one is raised.
     */
    open(correlationId: string, callback?: (err: any) => void): void;
    /**
     * Closes this endpoint and the GRPC server (service) that was opened earlier.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param callback          (optional) the function to call once the closing process is complete.
     *                          Will be called with an error if one is raised.
     */
    close(correlationId: string, callback?: (err: any) => void): void;
    /**
     * Registers a registerable object for dynamic endpoint discovery.
     *
     * @param registration      the registration to add.
     *
     * @see [[IRegisterable]]
     */
    register(registration: IRegisterable): void;
    /**
     * Unregisters a registerable object, so that it is no longer used in dynamic
     * endpoint discovery.
     *
     * @param registration      the registration to remove.
     *
     * @see [[IRegisterable]]
     */
    unregister(registration: IRegisterable): void;
    private performRegistrations;
    private registerCommandableService;
    private invokeCommandableMethod;
    /**
     * Registers a service with related implementation
     *
     * @param service        a GRPC service object.
     * @param implementation the service implementation methods.
     */
    registerService(service: any, implementation: any): void;
    /**
     * Registers a commandable method in this objects GRPC server (service) by the given name.,
     *
     * @param method        the GRPC method name.
     * @param schema        the schema to use for parameter validation.
     * @param action        the action to perform at the given route.
     */
    registerCommadableMethod(method: string, schema: Schema, action: (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => void): void;
}
