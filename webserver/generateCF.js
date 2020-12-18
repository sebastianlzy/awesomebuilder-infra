const fs = require('fs');
const cfTemplate = require('./Webserver.json')
const https = require('https');

const createSecurityGroups = async (limit = 60) => {

    const getAllAmazonIpRanges = async () => {

        return new Promise((resolve, reject) => {
            https.get('https://ip-ranges.amazonaws.com/ip-ranges.json', (resp) => {
                let data = '';

                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    resolve(JSON.parse(data)["prefixes"]);
                });

            }).on("error", (err) => {
                reject("Error: " + err.message);
            });
        })


    }

    const getCloudfrontIngressIps = async () => {
        const amazonIpRanges = await getAllAmazonIpRanges()
        return amazonIpRanges.reduce((acc, amazonIpRange) => {

            if (amazonIpRange.service === "CLOUDFRONT") {
                acc.push({
                    "IpProtocol": "tcp",
                    "FromPort": "80",
                    "ToPort": "80",
                    "CidrIp": amazonIpRange["ip_prefix"]
                })
            }

            return acc
        }, [])
    }

    const createSecurityGroup = (name, ingressIps) => {
        return {
            [name]: {
                "Type": "AWS::EC2::SecurityGroup",
                "Properties": {
                    "GroupDescription": "Enable port 80 access on the inbound port from CloudFront IP addresses",
                    "SecurityGroupIngress": ingressIps,
                    "VpcId": {
                        "Ref": "VpcId"
                    }
                }
            }
        }
    }

    const cloudfrontIngressIps = await getCloudfrontIngressIps()
    return [
        createSecurityGroup("ALBSecurityGroup1", cloudfrontIngressIps.slice(0, 60)),
        createSecurityGroup("ALBSecurityGroup2", cloudfrontIngressIps.slice(60))
    ]
}


const addReadReplica = (modifiedCfTemplate) => {
    modifiedCfTemplate.Resources["MyDBInstanceReplica"] = {
        "Type": "AWS::RDS::DBInstance",
        "Properties": {
            "SourceDBInstanceIdentifier": {
                "Ref": "MyDBInstance"
            },
            "DBInstanceClass": "db.t3.micro",
            "Tags": [
                {
                    "Key": "Name",
                    "Value": "Read Replica Database"
                }
            ]
        }
    }
}

const addALBSecurityGroup = async (modifiedCfTemplate) => {

    const isInternetAccessible = true
    const securityGroups = await createSecurityGroups()

    securityGroups.forEach((securityGroup) => {
        console.log(securityGroup)
        const name = Object.keys(securityGroup)[0]
        modifiedCfTemplate.Resources[name] = securityGroup[name]
    })


    //Allow port 80 access from 0.0.0.0
    modifiedCfTemplate["Resources"]["ApplicationLoadBalancer"]["Properties"]["SecurityGroups"] = [
        {"Ref": "ALBSecurityGroup"},
    ]

    if (!isInternetAccessible) {
        //Allow port 80 access from Cloudfront IP addresses
        modifiedCfTemplate["Resources"]["ApplicationLoadBalancer"]["Properties"]["SecurityGroups"] = [
            {"Ref": "ALBSecurityGroup1"},
            {"Ref": "ALBSecurityGroup2"},
        ]
    }

    return modifiedCfTemplate
}

addALBSecurityGroup(cfTemplate)
    .then((modifiedCfTemplate) => {
        // addReadReplica(modifiedCfTemplate)
        fs.writeFile('Webserver.json', JSON.stringify(modifiedCfTemplate), function (err) {
            if (err) return console.log(err);
            console.log('Output file to Webserver.json');
        });
    })


