// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// Copyright 2015 gRPC authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
'use strict';
var grpc = require('grpc');
var dummies_pb = require('./dummies_pb.js');

function serialize_dummies_DummiesPage(arg) {
  if (!(arg instanceof dummies_pb.DummiesPage)) {
    throw new Error('Expected argument of type dummies.DummiesPage');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dummies_DummiesPage(buffer_arg) {
  return dummies_pb.DummiesPage.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dummies_DummiesPageRequest(arg) {
  if (!(arg instanceof dummies_pb.DummiesPageRequest)) {
    throw new Error('Expected argument of type dummies.DummiesPageRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dummies_DummiesPageRequest(buffer_arg) {
  return dummies_pb.DummiesPageRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dummies_Dummy(arg) {
  if (!(arg instanceof dummies_pb.Dummy)) {
    throw new Error('Expected argument of type dummies.Dummy');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dummies_Dummy(buffer_arg) {
  return dummies_pb.Dummy.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dummies_DummyIdRequest(arg) {
  if (!(arg instanceof dummies_pb.DummyIdRequest)) {
    throw new Error('Expected argument of type dummies.DummyIdRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dummies_DummyIdRequest(buffer_arg) {
  return dummies_pb.DummyIdRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dummies_DummyObjectRequest(arg) {
  if (!(arg instanceof dummies_pb.DummyObjectRequest)) {
    throw new Error('Expected argument of type dummies.DummyObjectRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dummies_DummyObjectRequest(buffer_arg) {
  return dummies_pb.DummyObjectRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


// The dummies service definition.
var DummiesService = exports.DummiesService = {
  get_dummies: {
    path: '/dummies.Dummies/get_dummies',
    requestStream: false,
    responseStream: false,
    requestType: dummies_pb.DummiesPageRequest,
    responseType: dummies_pb.DummiesPage,
    requestSerialize: serialize_dummies_DummiesPageRequest,
    requestDeserialize: deserialize_dummies_DummiesPageRequest,
    responseSerialize: serialize_dummies_DummiesPage,
    responseDeserialize: deserialize_dummies_DummiesPage,
  },
  get_dummy_by_id: {
    path: '/dummies.Dummies/get_dummy_by_id',
    requestStream: false,
    responseStream: false,
    requestType: dummies_pb.DummyIdRequest,
    responseType: dummies_pb.Dummy,
    requestSerialize: serialize_dummies_DummyIdRequest,
    requestDeserialize: deserialize_dummies_DummyIdRequest,
    responseSerialize: serialize_dummies_Dummy,
    responseDeserialize: deserialize_dummies_Dummy,
  },
  create_dummy: {
    path: '/dummies.Dummies/create_dummy',
    requestStream: false,
    responseStream: false,
    requestType: dummies_pb.DummyObjectRequest,
    responseType: dummies_pb.Dummy,
    requestSerialize: serialize_dummies_DummyObjectRequest,
    requestDeserialize: deserialize_dummies_DummyObjectRequest,
    responseSerialize: serialize_dummies_Dummy,
    responseDeserialize: deserialize_dummies_Dummy,
  },
  update_dummy: {
    path: '/dummies.Dummies/update_dummy',
    requestStream: false,
    responseStream: false,
    requestType: dummies_pb.DummyObjectRequest,
    responseType: dummies_pb.Dummy,
    requestSerialize: serialize_dummies_DummyObjectRequest,
    requestDeserialize: deserialize_dummies_DummyObjectRequest,
    responseSerialize: serialize_dummies_Dummy,
    responseDeserialize: deserialize_dummies_Dummy,
  },
  delete_dummy_by_id: {
    path: '/dummies.Dummies/delete_dummy_by_id',
    requestStream: false,
    responseStream: false,
    requestType: dummies_pb.DummyIdRequest,
    responseType: dummies_pb.Dummy,
    requestSerialize: serialize_dummies_DummyIdRequest,
    requestDeserialize: deserialize_dummies_DummyIdRequest,
    responseSerialize: serialize_dummies_Dummy,
    responseDeserialize: deserialize_dummies_Dummy,
  },
};

exports.DummiesClient = grpc.makeGenericClientConstructor(DummiesService);
//  rpc get_dummies (DummiesPageRequest) returns (DummiesPageReply) {}
//  rpc get_dummy_by_id (DummyIdRequest) returns (DummyObjectReply) {}
//  rpc create_dummy (DummyObjectRequest) returns (DummyObjectReply) {}
//  rpc update_dummy (DummyObjectRequest) returns (DummyObjectReply) {}
//  rpc delete_dummy_by_id (DummyIdRequest) returns (DummyObjectReply) {}
