const fs = require('fs');
const cfTemplate = require('./Webserver.json')

const addReadReplica = () => {
    cfTemplate.Resources["MyDBInstanceReplica"] = {
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

addReadReplica()

fs.writeFile('Webserver-1.json', JSON.stringify(cfTemplate), function (err) {
    if (err) return console.log(err);
    console.log('Output file to Webserver-1.json');
});