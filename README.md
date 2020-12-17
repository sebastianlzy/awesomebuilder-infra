## Introduction

[AWS CloudFormation](https://aws.amazon.com/cloudformation/) gives you an easy way to model a collection of related AWS and third-party resources, provision them quickly and consistently, and manage them throughout their lifecycles, by treating infrastructure as code. 

A CloudFormation template describes the desired resources and their dependencies so you can launch and configure them together as a stack. 

### Advantage of Infrastructure as Code (Cloudformation)

#### 1. Deployment speed
As all the environments are provisioned using Cloudformation, 
you are able to manage and provision stacks across multiple AWS accounts and AWS Regions.
 
#### 2. Immutable infrastructure
    1. Eliminate human error
#### 3. Change management
    1. Ability to rollback
    2. Traceable
#### 4. High scalability
#### 5. Shorter feedback loops

### High level architecture


![alt High Level architecture](https://raw.githubusercontent.com/sebastianlzy/draw-io/master/awesomebuilderIII%20-POC.png)

### VPC.yaml

An explanation on the different component inside the CF template that will serve as the foundation for networking 

![alt High Level architecture](https://raw.githubusercontent.com/sebastianlzy/draw-io/master/awesomebuilderIII%20-VPC%20Cloudformation.png)

### Webserver.yaml

An explanation on the different component inside the CF template that will serve as the foundation to launch an application

![alt Webserver cloudformation](https://github.com/sebastianlzy/draw-io/raw/master/awesomebuilderIII%20-Webserver%20Cloudformation.png)
