/** @module build */
import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';
/**
 * Creates GRPC components by their descriptors.
 *
 * @see [[https://pip-services3-node.github.io/pip-services3-components-node/classes/build.factory.html Factory]]
 * @see [[GrpcEndpoint]]
 * @see [[HeartbeatGrpcService]]
 * @see [[StatusGrpcService]]
 */
export declare class DefaultGrpcFactory extends Factory {
    static readonly Descriptor: Descriptor;
    static readonly GrpcEndpointDescriptor: Descriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
