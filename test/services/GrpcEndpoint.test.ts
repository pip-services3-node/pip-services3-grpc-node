let assert = require('chai').assert;
let async = require('async');

import { Descriptor } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { GrpcEndpoint } from '../../src/services/GrpcEndpoint';

var grpcConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

suite('GrpcEndpoint', ()=> {
    let endpoint: GrpcEndpoint;

    suiteSetup((done) => {
        endpoint = new GrpcEndpoint();
        endpoint.configure(grpcConfig);

        endpoint.open(null, done);
    });
    
    suiteTeardown((done) => {
        endpoint.close(null, done);
    });

    test('Is Open', (done) => {
        assert.isTrue(endpoint.isOpen());

        done();
    });

});
