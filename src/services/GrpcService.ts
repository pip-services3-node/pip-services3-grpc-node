/** @module services */
/** @hidden */
const _ = require('lodash');
/** @hidden */
const async = require('async');

import { IOpenable } from 'pip-services3-commons-node';
import { IUnreferenceable } from 'pip-services3-commons-node';
import { InvalidStateException } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { DependencyResolver } from 'pip-services3-commons-node';
import { CompositeLogger } from 'pip-services3-components-node';
import { CompositeCounters } from 'pip-services3-components-node';
import { Timing } from 'pip-services3-components-node';
import { Schema } from 'pip-services3-commons-node';

import { GrpcEndpoint } from './GrpcEndpoint';
import { IRegisterable } from './IRegisterable';

/**
 * Abstract service that receives remove calls via GRPC protocol.
 * 
 * ### Configuration parameters ###
 * 
 * - dependencies:
 *   - endpoint:              override for GRPC Endpoint dependency
 *   - controller:            override for Controller dependency
 * - connection(s):           
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - protocol:              connection protocol: http or https
 *   - host:                  host name or IP address
 *   - port:                  port number
 *   - uri:                   resource URI or connection string with all parameters in it
 * - credential - the HTTPS credentials:
 *   - ssl_key_file:         the SSL private key in PEM
 *   - ssl_crt_file:         the SSL certificate in PEM
 *   - ssl_ca_file:          the certificate authorities (root cerfiticates) in PEM
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>               (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>             (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>            (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * - <code>\*:endpoint:grpc:\*:1.0</code>           (optional) [[GrpcEndpoint]] reference
 * 
 * @see [[GrpcClient]]
 * 
 * ### Example ###
 * 
 *     class MyGrpcService extends GrpcService {
 *        private _controller: IMyController;
 *        ...
 *        public constructor() {
 *           base('... path to proto ...', '.. service name ...');
 *           this._dependencyResolver.put(
 *               "controller",
 *               new Descriptor("mygroup","controller","*","*","1.0")
 *           );
 *        }
 * 
 *        public setReferences(references: IReferences): void {
 *           base.setReferences(references);
 *           this._controller = this._dependencyResolver.getRequired<IMyController>("controller");
 *        }
 * 
 *        public register(): void {
 *            registerMethod("get_mydata", null, (call, callback) => {
 *                let correlationId = call.request.correlationId;
 *                let id = call.request.id;
 *                this._controller.getMyData(correlationId, id, callback);
 *            });
 *            ...
 *        }
 *     }
 * 
 *     let service = new MyGrpcService();
 *     service.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *     service.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","controller","default","default","1.0"), controller
 *     ));
 * 
 *     service.open("123", (err) => {
 *        console.log("The GRPC service is running on port 8080");
 *     });
 */
export abstract class GrpcService implements IOpenable, IConfigurable, IReferenceable,
    IUnreferenceable, IRegisterable {

    private static readonly _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        "dependencies.endpoint", "*:endpoint:grpc:*:1.0"
    );

    private _service: any;
    private _protoPath: string;
    private _serviceName: string;
    private _packageOptions: any;
    private _config: ConfigParams;
    private _references: IReferences;
    private _localEndpoint: boolean;
    private _registerable: IRegisterable;
    private _implementation: any = {};
    private _interceptors: any[] = [];
    private _opened: boolean;

    /**
     * The GRPC endpoint that exposes this service.
     */
    protected _endpoint: GrpcEndpoint;    
    /**
     * The dependency resolver.
     */
    protected _dependencyResolver: DependencyResolver = new DependencyResolver(GrpcService._defaultConfig);
    /**
     * The logger.
     */
    protected _logger: CompositeLogger = new CompositeLogger();
    /**
     * The performance counters.
     */
	protected _counters: CompositeCounters = new CompositeCounters();

    public constructor(serviceOrPath: any, serviceName?: string, packageOptions?: any) {
        this._service = !_.isString(serviceOrPath) ? serviceOrPath : null;
        this._protoPath = _.isString(serviceOrPath) ? serviceOrPath : null;
        this._serviceName = serviceName;
        this._packageOptions = packageOptions;

        this._registerable = {
            register: () => {
                this.registerService();
            }
        }
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
	public configure(config: ConfigParams): void {
        config = config.setDefaults(GrpcService._defaultConfig);

        this._config = config;
        this._dependencyResolver.configure(config);
	}

    /**
	 * Sets references to dependent components.
	 * 
	 * @param references 	references to locate the component dependencies. 
     */
	public setReferences(references: IReferences): void {
        this._references = references;

		this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._dependencyResolver.setReferences(references);

        // Get endpoint
        this._endpoint = this._dependencyResolver.getOneOptional('endpoint');
        // Or create a local one
        if (this._endpoint == null) {
            this._endpoint = this.createEndpoint();
            this._localEndpoint = true;
        } else {
            this._localEndpoint = false;
        }
        // Add registration callback to the endpoint
        this._endpoint.register(this._registerable);
    }
    
    /**
	 * Unsets (clears) previously set references to dependent components. 
     */
    public unsetReferences(): void {
        // Remove registration callback from endpoint
        if (this._endpoint != null) {
            this._endpoint.unregister(this._registerable);
            this._endpoint = null;
        }
    }

    private createEndpoint(): GrpcEndpoint {
        let endpoint = new GrpcEndpoint();
        
        if (this._config)
            endpoint.configure(this._config);
        
        if (this._references)
            endpoint.setReferences(this._references);
            
        return endpoint;
    }

    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a Timing object that is used to end the time measurement.
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param name              a method name.
     * @returns Timing object to end the time measurement.
     */
	protected instrument(correlationId: string, name: string): Timing {
        this._logger.trace(correlationId, "Executing %s method", name);
        this._counters.incrementOne(name + '.exec_count');
		return this._counters.beginTiming(name + ".exec_time");
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
    protected instrumentError(correlationId: string, name: string, err: any,
        result: any = null, callback: (err: any, result: any) => void = null): void {
        if (err != null) {
            this._logger.error(correlationId, err, "Failed to execute %s method", name);
            this._counters.incrementOne(name + '.exec_errors');    
        }

        if (callback) callback(err, result);
    }    
    /**
	 * Checks if the component is opened.
	 * 
	 * @returns true if the component has been opened and false otherwise.
     */
	public isOpen(): boolean {
		return this._opened;
	}
    
    /**
	 * Opens the component.
	 * 
	 * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
	public open(correlationId: string, callback?: (err: any) => void): void {
    	if (this._opened) {
            callback(null);
            return;
        }
        
        if (this._endpoint == null) {
            this._endpoint = this.createEndpoint();
            this._endpoint.register(this);
            this._localEndpoint = true;
        }

        if (this._localEndpoint) {
            this._endpoint.open(correlationId, (err) => {
                this._opened = err == null;
                callback(err);
            });
        } else {
            this._opened = true;
            callback(null);
        }
    }

    /**
	 * Closes component and frees used resources.
	 * 
	 * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    public close(correlationId: string, callback?: (err: any) => void): void {
    	if (!this._opened) {
            callback(null);
            return;
        }

        if (this._endpoint == null) {
            callback(new InvalidStateException(correlationId, 'NO_ENDPOINT', 'HTTP endpoint is missing'));
            return;
        }
        
        if (this._localEndpoint) {
            this._endpoint.close(correlationId, (err) => {
                this._opened = false;
                callback(err);
            });
        } else {
            this._opened = false;
            callback(null);
        }
    }

    // /**
    //  * Creates a callback function that sends result as JSON object.
    //  * That callack function call be called directly or passed
    //  * as a parameter to business logic components.
    //  * 
    //  * If object is not null it returns 200 status code.
    //  * For null results it returns 204 status code.
    //  * If error occur it sends ErrorDescription with approproate status code.
    //  * 
    //  * @param req       a HTTP request object.
    //  * @param res       a HTTP response object.
    //  * @param callback function that receives execution result or error.
    //  */
    // protected sendResult(req, res): (err: any, result: any) => void {
    //     return HttpResponseSender.sendResult(req, res);
    // }

    // /**
    //  * Creates a callback function that sends newly created object as JSON.
    //  * That callack function call be called directly or passed
    //  * as a parameter to business logic components.
    //  * 
    //  * If object is not null it returns 201 status code.
    //  * For null results it returns 204 status code.
    //  * If error occur it sends ErrorDescription with approproate status code.
    //  * 
    //  * @param req       a HTTP request object.
    //  * @param res       a HTTP response object.
    //  * @param callback function that receives execution result or error.
    //  */
    // protected sendCreatedResult(req, res): (err: any, result: any) => void {
    //     return HttpResponseSender.sendCreatedResult(req, res);
    // }

    // /**
    //  * Creates a callback function that sends deleted object as JSON.
    //  * That callack function call be called directly or passed
    //  * as a parameter to business logic components.
    //  * 
    //  * If object is not null it returns 200 status code.
    //  * For null results it returns 204 status code.
    //  * If error occur it sends ErrorDescription with approproate status code.
    //  * 
    //  * @param req       a HTTP request object.
    //  * @param res       a HTTP response object.
    //  * @param callback function that receives execution result or error.
    //  */
    // protected sendDeletedResult(req, res): (err: any, result: any) => void {
    //     return HttpResponseSender.sendDeletedResult(req, res);
    // }

    // /**
    //  * Sends error serialized as ErrorDescription object
    //  * and appropriate HTTP status code.
    //  * If status code is not defined, it uses 500 status code.
    //  * 
    //  * @param req       a HTTP request object.
    //  * @param res       a HTTP response object.
    //  * @param error     an error object to be sent.
    //  */
    // protected sendError(req, res, error): void {
    //     HttpResponseSender.sendError(req, res, error);
    // }

    private registerService() {
        // Register implementations
        this._implementation = {};
        this._interceptors = [];
        this.register();
    
        // Load service
        let grpc = require('grpc');
        let service = this._service;

        // Dynamically load service
        if (service == null && _.isString(this._protoPath)) {
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
            service = this.getServiceByName(packageObject, this._serviceName);            
        } 
        // Statically load service
        else {
            service = this.getServiceByName(this._service, this._serviceName);
        }

        // Register service if it is set
        if (service) {
            this._endpoint.registerService(service, this._implementation);
        }
    }

    private getServiceByName(packageObject: any, serviceName: string): any {
        if (packageObject == null || serviceName == null)
            return packageObject;

        let names = serviceName.split(".");
        for (let name of names) {
            packageObject = packageObject[name];
            if (packageObject == null) break;
        }

        return packageObject;
    }

    /**
     * Registers a method in GRPC service.
     * 
     * @param name          a method name
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when operation is invoked.
     */
    protected registerMethod(name: string, schema: Schema,
        action: (call: any, callback: (err: any, message: any) => void) => void): void {
        if (this._implementation == null) return;

        this._implementation[name] = (call, callback) => {
            async.each(this._interceptors, (interceptor, cb) => {
                interceptor(call, callback, cb);
            }, (err) => {
                // Validate object
                if (schema && call && call.request) {
                    let value = call.request;
                    if (_.isFunction(value.toObject))
                        value = value.toObject();

                    // Perform validation                    
                    let correlationId = value.correlation_id;
                    let err = schema.validateAndReturnException(correlationId, value, false);
                    if (err) {
                        callback(err, null);
                        return;
                    }
                }

                action.call(this, call, callback);
            });
        };
    }    

    /**
     * Registers a commandable method in this objects GRPC server (service) by the given name.,
     * 
     * @param method        the GRPC method name.
     * @param schema        the schema to use for parameter validation.
     * @param action        the action to perform at the given route.
     */
    protected registerCommadableMethod(method: string, schema: Schema,
        action: (correlationId: string, data: any, callback: (err: any, result: any) => void) => void): void {

        this._endpoint.registerCommadableMethod(method, schema, (correlationId, data, callback) => {
            action.call(this, correlationId, data, callback);
        });
    }

    // /**
    //  * Registers a route with authorization in HTTP endpoint.
    //  * 
    //  * @param method        HTTP method: "get", "head", "post", "put", "delete"
    //  * @param route         a command route. Base route will be added to this route
    //  * @param schema        a validation schema to validate received parameters.
    //  * @param authorize     an authorization interceptor
    //  * @param action        an action function that is called when operation is invoked.
    //  */
    // protected registerRouteWithAuth(method: string, route: string, schema: Schema,
    //     authorize: (req: any, res: any, next: () => void) => void,
    //     action: (req: any, res: any) => void): void {
    //     if (this._endpoint == null) return;

    //     route = this.appendBaseRoute(route);

    //     this._endpoint.registerRouteWithAuth(
    //         method, route, schema,
    //         (req, res, next) => {
    //             if (authorize)
    //                 authorize.call(this, req, res, next);
    //             else next();
    //         },
    //         (req, res) => {
    //             action.call(this, req, res);
    //         }
    //     );
    // }    

    /**
     * Registers a middleware for methods in GRPC endpoint.
     * 
     * @param action        an action function that is called when middleware is invoked.
     */
    protected registerInterceptor(
        action: (call: any, callback: (err: any, result: any) => void, next: () => void) => void): void {
        if (this._endpoint == null) return;

        this._interceptors.push((call, callback, next) => {
            action.call(this, call, callback, next);
        });
    }    
    
    /**
     * Registers all service routes in HTTP endpoint.
     * 
     * This method is called by the service and must be overriden
     * in child classes.
     */
    public abstract register(): void;

}