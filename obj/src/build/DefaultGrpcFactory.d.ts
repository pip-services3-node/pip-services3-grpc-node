/** @module build */
import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';
/**
 * Creates GRPC components by their descriptors.
 *
 * @see [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/classes/build.factory.html Factory]]
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
