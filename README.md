## Introduction


    
### High level architecture


![alt High Level architecture](https://raw.githubusercontent.com/sebastianlzy/draw-io/master/awesomebuilderIII%20-POC.png)

## Cloudformation

[AWS CloudFormation](https://aws.amazon.com/cloudformation/) gives you an easy way to model a collection of related AWS and third-party resources, provision them quickly and consistently, and manage them throughout their lifecycles, by treating infrastructure as code. 

A CloudFormation template describes the desired resources and their dependencies so you can launch and configure them together as a stack. 

### Advantage of Infrastructure as Code (Cloudformation)
 
#### 1. Consistent infrastructure
One of the biggest cause of application failure is due to inability to mimic consistent production environment across the different stages for testing purposes. 

Cloudformation eliminates this problem by allowing the infrastructure to be instantiated in a consistent and automated way. This remove the risk where different servers develop different configuration often due to human error. 

#### 2. Reduce time to market
From time to time, businesses needs to launch new initiatives that require new applications and software features development, tools or technology procurement. However, these new initiatives often requires time and expertise from system developer to integrate with existing infrasturcture due to a composition of manual and poorly documented process and procedures of their system. 

As all the environments are provisioned using Cloudformation, 
system developer are able to quickly understand the existing infrasturcture and automate provisioning of new/existing resources that are able to work together across multiple AWS accounts and AWS Regions. Cloudformation also makes it easy to add/upgrade resources to existing infrastructure with ease during burst periods.

    
#### 3. Change management
Together with the use of version control, system developers can collaborate easily and roll out changes in a controlled manner. With a single source of truth, problems with environment change can be easily identified and a rollback policy can be triggered to bring the infrastructure back to a working state
 

## Awesomebuilder

### VPC.yaml

An explanation on the different component inside the CF template that will serve as the foundation for networking 

![alt High Level architecture](https://raw.githubusercontent.com/sebastianlzy/draw-io/master/awesomebuilderIII%20-VPC%20Cloudformation.png)

### Webserver.yaml

An explanation on the different component inside the CF template that will serve as the foundation to launch an application

![alt Webserver cloudformation](https://github.com/sebastianlzy/draw-io/raw/master/awesomebuilderIII%20-Webserver%20Cloudformation.png)
