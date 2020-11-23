# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200"> <br/> GRPC Calls for Node.js

This module is a part of the [Pip.Services](http://pipservices.org) polyglot microservices toolkit.

The grpc module is used to organize synchronous data exchange using calls through the gRPC protocol. It has implementations of both the server and client parts.

- **Build** - factories for creating gRPC services
- **Clients** - basic client components that use the gRPC protocol and Commandable pattern through gRPC
- **Services** - basic service implementations for connecting via the gRPC protocol and using the Commandable pattern via gRPC

<a name="links"></a> Quick links:

* [API Reference](https://pip-services3-node.github.io/pip-services3-rpc-node/globals.html)
* [Change Log](CHANGELOG.md)
* [Get Help](https://www.pipservices.org/community/help)
* [Contribute](https://www.pipservices.org/community/contribute)

## Use

Install the NPM package as
```bash
npm install pip-services3-grpc-node --save
```

## Configuration

The components from this module have the ability to customize their work without changing the code.
The component is configured using the configuration file in the yaml or json format.
For example, consider the process of configuring through a yaml file.

To pass parameters to a component, you first need to specify its descriptor, and then configure it below. Component settings can be divided into groups, so for some parameters, you first need to specify a group, and then set a specific parameter in this group.

config.yml

```yml
- descriptor: mygroup:mycomponent1:default:default:1.0
  group:
    param1: 12345
    param2: ABCDE
```

Each component has its own set of parameters; for convenience, the list of components and the list of parameters for them are given in the following link [Components list](CONFIGURATION.md).

If you are developing your own component from scratch or inheriting from an existing component and want to add your own set of parameters to it, then [Configuration](https://www.pipservices.org/recipies/configuration) article will help you understand this issue.

## Develop

For development you shall install the following prerequisites:
* Node.js 8+
* Visual Studio Code or another IDE of your choice
* Docker
* Typescript

Install dependencies:
```bash
npm install
```

Compile the code:
```bash
tsc
```

Run automated tests:
```bash
npm test
```

Generate API documentation:
```bash
./docgen.ps1
```

Before committing changes run dockerized build and test as:
```bash
./build.ps1
./test.ps1
./clear.ps1
```

## Contacts

The Node.js version of Pip.Services is created and maintained by:
- **Sergey Seroukhov**

The documentation is written by:
- **Mark Makarychev**
