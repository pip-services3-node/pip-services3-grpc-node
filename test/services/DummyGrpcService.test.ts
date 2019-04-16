let assert = require('chai').assert;
let grpc = require('grpc');
let async = require('async');

let services = require('../../../test/protos/dummies_grpc_pb');
let messages = require('../../../test/protos/dummies_pb');

import { Descriptor } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { Dummy } from '../Dummy';
import { DummyController } from '../DummyController';
import { DummyGrpcService } from './DummyGrpcService';

var grpcConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

suite('DummyGrpcService', ()=> {
    var _dummy1: Dummy;
    var _dummy2: Dummy;

    let service: DummyGrpcService;

    let client: any;

    suiteSetup((done) => {
        let ctrl = new DummyController();

        service = new DummyGrpcService();
        service.configure(grpcConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services-dummies', 'controller', 'default', 'default', '1.0'), ctrl,
            new Descriptor('pip-services-dummies', 'service', 'grpc', 'default', '1.0'), service
        );
        service.setReferences(references);

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup(() => {
        client = new services.DummiesClient('localhost:3000', grpc.credentials.createInsecure());

        _dummy1 = { id: null, key: "Key 1", content: "Content 1"};
        _dummy2 = { id: null, key: "Key 2", content: "Content 2"};
    });

    test('CRUD Operations', (done) => {
        var dummy1, dummy2;

        async.series([
        // Create one dummy
            (callback) => {
                let dummy = new messages.Dummy();
                dummy.setId(_dummy1.id);
                dummy.setKey(_dummy1.key);
                dummy.setContent(_dummy1.content);

                let request = new messages.DummyObjectRequest();
                request.setDummy(dummy);

                client.create_dummy(request,
                    (err, dummy) => {
                        assert.isNull(err);
                        
                        dummy = dummy.toObject();
                        assert.isObject(dummy);
                        assert.equal(dummy.content, _dummy1.content);
                        assert.equal(dummy.key, _dummy1.key);

                        dummy1 = dummy;

                        callback();
                    }
                );
            },
        // Create another dummy
            (callback) => {
                let dummy = new messages.Dummy();
                dummy.setId(_dummy2.id);
                dummy.setKey(_dummy2.key);
                dummy.setContent(_dummy2.content);

                let request = new messages.DummyObjectRequest();
                request.setDummy(dummy);

                client.create_dummy(request,
                    (err, dummy) => {
                        assert.isNull(err);
                        
                        dummy = dummy.toObject();
                        assert.isObject(dummy);
                        assert.equal(dummy.content, _dummy2.content);
                        assert.equal(dummy.key, _dummy2.key);

                        dummy2 = dummy;

                        callback();
                    }
                );
            },
        // Get all dummies
            (callback) => {
                let request = new messages.DummiesPageRequest();

                client.get_dummies(request,
                    (err, dummies) => {
                        assert.isNull(err);
                        
                        dummies = dummies.toObject();
                        assert.isObject(dummies);
                        assert.lengthOf(dummies.dataList, 2);

                        callback();
                    }
                );
            },
        // Update the dummy
            (callback) => {
                dummy1.content = 'Updated Content 1';

                let dummy = new messages.Dummy();
                dummy.setId(dummy1.id);
                dummy.setKey(dummy1.key);
                dummy.setContent(dummy1.content);

                let request = new messages.DummyObjectRequest();
                request.setDummy(dummy);

                client.update_dummy(request,
                    (err, dummy) => {
                        assert.isNull(err);
                        
                        dummy = dummy.toObject();
                        assert.isObject(dummy);
                        assert.equal(dummy.content, 'Updated Content 1');
                        assert.equal(dummy.key, _dummy1.key);

                        dummy1 = dummy;

                        callback();
                    }
                );
            },
        // Delete dummy
            (callback) => {
                let request = new messages.DummyIdRequest();
                request.setDummyId(dummy1.id);

                client.delete_dummy_by_id(request,
                    (err, dummy) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete dummy
            (callback) => {
                let request = new messages.DummyIdRequest();
                request.setDummyId(dummy1.id);

                client.get_dummy_by_id(request,
                    (err, dummy) => {
                        assert.isNull(err);
                        
                        // assert.isObject(dummy);

                        callback();
                    }
                );
            }
        ], done);
    });

});
