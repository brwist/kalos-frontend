import { grpc } from "@improbable-eng/grpc-web";
import { NodeHttpTransport } from "@improbable-eng/grpc-web-node-http-transport";

// Do this first, before you make any grpc requests!
grpc.setDefaultTransport(NodeHttpTransport());