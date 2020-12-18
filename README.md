# Introduction

    
## High level architecture


![alt High Level architecture](https://raw.githubusercontent.com/sebastianlzy/draw-io/master/awesomebuilder/awesomebuilderIII-POC.png)

## Cloudformation

[AWS CloudFormation](https://aws.amazon.com/cloudformation/) gives you an easy way to model a collection of related AWS and third-party resources, provision them quickly and consistently, and manage them throughout their lifecycles, by treating infrastructure as code. 

A CloudFormation template describes the desired resources and their dependencies so you can launch and configure them together as a stack. 

### Advantage of Infrastructure as Code (Cloudformation)
 
#### 1. Consistent infrastructure
One of the biggest cause of application failure is due to inability to mimic consistent production environment across the different stages for testing purposes. 

Cloudformation eliminates this problem by allowing the infrastructure to be instantiated in a consistent and automated way. This remove the risk where different servers develop different configuration often due to human error. 

#### 2. Reduce time to market
From time to time, businesses needs to launch new initiatives that require new applications and software features development, tools or technology procurement. However, these new initiatives often requires time and expertise from system developers to integrate with existing infrasturcture due to a composition of manual and poorly documented process and procedures of their system. 

As all the environments are provisioned using Cloudformation, 
system developer are able to quickly understand the existing infrasturcture and automate provisioning of new/existing resources that are able to work together across multiple AWS accounts and AWS Regions. Cloudformation also makes it easy to add/upgrade resources to existing infrastructure with ease during burst periods.

    
#### 3. Change management
Together with the use of version control, system developers can collaborate easily and roll out changes in a controlled manner. With a single source of truth, problems with environment change can be easily identified and a rollback policy can be triggered to bring the infrastructure back to a working state
 

## Awesomebuilder

### VPC.yaml

An explanation on the different component inside the CF template that will serve as the foundation for networking 

1. 2 private subnet
2. 2 public subnet

![alt High Level architecture](https://raw.githubusercontent.com/sebastianlzy/draw-io/master/awesomebuilder/awesomebuilderIII-VPC%20Cloudformation.png)


### Webserver.yaml

An explanation on the different component inside the CF template that will serve as the foundation to launch an application

1. Elastic load balancer
2. Webserver
3. Database

![alt Webserver cloudformation](https://github.com/sebastianlzy/draw-io/raw/master/awesomebuilder/awesomebuilderIII-Webserver%20Cloudformation.png)

### Security


#### 1. Use of private subnet

Private subnet are not publicly accessible. Instances in private subnet cannot send outbound traffic directly to the internet. Instead, the instances can access the internet using network address translation (NAT) gateway that resides in the public subnet. 

In the diagram, the webserver and database resides in a private subnet and only the application load balancer is exposed to the internet

#### 2. Use of security group

A security group acts as a virtual firewall for instances to control inbound and outbound traffic. Security group act at the instance level and each instance can be assigned to a different set of security group

In the diagram, each instance type is assigned a security group that limit inbound access. 

1. The ALBSecurityGroup attached to the application load balancer restrict access from the internet to TCP:80. 
2. The InstanceSecurityGroup attached to the webserver restrict access to TCP:80 from ALBSecurityGroup and TCP:22 from JenkinsSecurityGroup
3. The DBSecurityGroup attached to the database restrict access to TCP:3306 from InstanceSecurityGroup and JenkinsSecurityGroup

#### 3. Use of secret manager

Secret Manager helps protect secrets needed to access the database. Application can retrieve secrets with a call to Secret Managers API, hence, eliminating the need to hardcode sensitive information in plain text

Example of use of secret manager in Cloudformation

``` js
// https://github.com/sebastianlzy/awesomebuilder-infra/blob/master/webserver/Webserver.json#L435

{
  "MyDBInstance": {
    "Type": "AWS::RDS::DBInstance",
    "Properties": {
      "AllocatedStorage": 25,
      "DBInstanceClass": "db.t3.micro",
      "Engine": "mysql",
      "DBSubnetGroupName": {
        "Ref": "PrivateDBSubnetGroup"
      },
      "DBSecurityGroups": [
        {
          "Ref": "DBSecurityGroup"
        }
      ],
      "MasterUsername": {
        "Fn::Sub": "{{resolve:secretsmanager:${MyRDSInstanceRotationSecret}::username}}"
      },
      "MasterUserPassword": {
        "Fn::Sub": "{{resolve:secretsmanager:${MyRDSInstanceRotationSecret}::password}}"
      },
      "MultiAZ": "true",
      "BackupRetentionPeriod": 1,
      "Tags": [
        {
          "Key": "project",
          "Value": "awesomebuilder"
        },
        {
          "Key": "Name",
          "Value": "awesomebuilder-rds"
        }
      ]
    }
  }
}

```

Example of use of secret manager in application code

```js
// https://github.com/sebastianlzy/awesomebuilder-ui/blob/master/server/index.js#L31

const getDBConnectionParams = async () => {
    const params = {
        SecretId: "MyRDSInstanceRotationSecret-E8RVFHtdPBvC",
        VersionStage: "AWSCURRENT"
    };

    return new Promise((resolve, reject) => {

        secretsmanager.getSecretValue(params, function (err, data) {
            if (err) {
                reject(err)
                return
            }
            const secret = JSON.parse(get(data, "SecretString", {}))
            resolve({
                    host: get(secret, 'host'),
                    user: get(secret, 'username'),
                    password: get(secret, 'password'),
                }
            )
        });
    })
}

```