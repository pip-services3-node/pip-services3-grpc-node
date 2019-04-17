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
var commandable_pb = require('./commandable_pb.js');

function serialize_commandable_InvokeReply(arg) {
  if (!(arg instanceof commandable_pb.InvokeReply)) {
    throw new Error('Expected argument of type commandable.InvokeReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_commandable_InvokeReply(buffer_arg) {
  return commandable_pb.InvokeReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_commandable_InvokeRequest(arg) {
  if (!(arg instanceof commandable_pb.InvokeRequest)) {
    throw new Error('Expected argument of type commandable.InvokeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_commandable_InvokeRequest(buffer_arg) {
  return commandable_pb.InvokeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


// The commandable service definition.
var CommandableService = exports.CommandableService = {
  invoke: {
    path: '/commandable.Commandable/invoke',
    requestStream: false,
    responseStream: false,
    requestType: commandable_pb.InvokeRequest,
    responseType: commandable_pb.InvokeReply,
    requestSerialize: serialize_commandable_InvokeRequest,
    requestDeserialize: deserialize_commandable_InvokeRequest,
    responseSerialize: serialize_commandable_InvokeReply,
    responseDeserialize: deserialize_commandable_InvokeReply,
  },
};

exports.CommandableClient = grpc.makeGenericClientConstructor(CommandableService);
