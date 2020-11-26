/** @module services */
import { ICommandable } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';

import { GrpcService } from './GrpcService';

/**
 * Abstract service that receives commands via GRPC protocol
 * to operations automatically generated for commands defined in [[https://pip-services3-node.github.io/pip-services3-commons-node/interfaces/commands.icommandable.html ICommandable components]].
 * Each command is exposed as invoke method that receives command name and parameters.
 * 
 * Commandable services require only 3 lines of code to implement a robust external
 * GRPC-based remote interface.
 * 
 * ### Configuration parameters ###
 * 
 * - dependencies:
 *   - endpoint:              override for HTTP Endpoint dependency
 *   - controller:            override for Controller dependency
 * - connection(s):           
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - protocol:              connection protocol: http or https
 *   - host:                  host name or IP address
 *   - port:                  port number
 *   - uri:                   resource URI or connection string with all parameters in it
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>               (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>             (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>            (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * - <code>\*:endpoint:grpc:\*:1.0</code>          (optional) [[GrpcEndpoint]] reference
 * 
 * @see [[CommandableGrpcClient]]
 * @see [[GrpcService]]
 * 
 * ### Example ###
 * 
 *     class MyCommandableGrpcService extends CommandableGrpcService {
 *        public constructor() {
 *           base();
 *           this._dependencyResolver.put(
 *               "controller",
 *               new Descriptor("mygroup","controller","*","*","1.0")
 *           );
 *        }
 *     }
 * 
 *     let service = new MyCommandableGrpcService();
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
export abstract class CommandableGrpcService extends GrpcService {
    private _name: string;
    private _commandSet: CommandSet;

    /**
     * Creates a new instance of the service.
     * 
     * @param name a service name.
     */
    public constructor(name: string) {
        super(null);
        this._name = name;
        this._dependencyResolver.put('controller', 'none');
    }

    /**
     * Registers all service routes in HTTP endpoint.
     */
    public register(): void {
        let controller: ICommandable = this._dependencyResolver.getOneRequired<ICommandable>('controller');
        this._commandSet = controller.getCommandSet();

        let commands = this._commandSet.getCommands();
        for (let index = 0; index < commands.length; index++) {
            let command = commands[index];

            let method = '' + this._name + '.' + command.getName();

            this.registerCommadableMethod(method, null, (correlationId, args, callback) => {
                let timing = this.instrument(correlationId, method);

                command.execute(correlationId, args, (err, result) => {
                    timing.endTiming();
                    this.instrumentError(correlationId, method, err, result, callback);
                })
            });
        }
    }
}