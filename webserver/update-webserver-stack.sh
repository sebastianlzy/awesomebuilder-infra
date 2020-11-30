STACK_NAME=Webserver
FILE_PATH=~/workplace/awesomebuilder/infra/webserver
S3_PATH=s3://awesome-builder-infra
S3_HTTP_URI=https://awesome-builder-infra.s3-ap-southeast-1.amazonaws.com


echo 'cp file to s3://awesome-builder-infra/Webserver.yaml'
aws s3 cp $FILE_PATH/Webserver.json $S3_PATH/Webserver.json

echo 'create parameters.json from export values'
aws cloudformation list-exports | jq "[.Exports[] | {ParameterKey: .Name, ParameterValue: .Value}]" > $FILE_PATH/parameters.json
echo 'cat parameters.json'
cat $FILE_PATH/parameters.json
echo "updating stack $STACK_NAME"
aws cloudformation update-stack --stack-name $STACK_NAME --template-url $S3_HTTP_URI/Webserver.json --parameters "$(cat $FILE_PATH/parameters.json)"
echo 'waiting for stack to be updated'
aws cloudformation wait stack-update-complete --stack-name $STACK_NAME
echo 'stack updated'
aws cloudformation describe-stacks --stack-name Webserver | jq ".Stacks[].Outputs[] | {Url: .OutputValue}"

