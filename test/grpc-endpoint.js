import { grpc } from "@improbable-eng/grpc-web";
import { NodeHttpTransport } from "@improbable-eng/grpc-web-node-http-transport";

// So this can work in a Node environment (aka Mocha)
grpc.setDefaultTransport(NodeHttpTransport());