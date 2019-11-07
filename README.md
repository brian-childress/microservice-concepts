# Microservice Concepts

Microservice architectures are a popular solution for many issues we see in large scale applications today, and for good reason. Microservices allow us to abstract functionality into their own service allowing for better utilization of resources (developers, infrastructure, etc.) that meet the true demands on a system. In the case case of microservices, micro does *not* mean small, it means isolated; a single area of functionality that can be developed and deployed independently, and consumed by other services.

In this repository, I've created sample applications that provide a real-world implementation of patterns and concepts that are leveraged in microservices today. These concepts can be added to new or existing applications to provide additional resiliency and performance.

## Concepts

### Circuit Breaker

The circuit breaker pattern allows a service or services to manage connections with other services by monitoring failed requests that exceed a threshold.This allows a service to continue to operate without attempting to communicate with a service that is experiencing issues.

[Circuit Breaker](./circuit-breaker/README.md)