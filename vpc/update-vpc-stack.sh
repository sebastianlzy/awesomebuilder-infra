STACK_NAME=VPC
FILE_PATH=~/workplace/awesomebuilder/infra/vpc
S3_HTTP_URI=https://awesome-builder-infra.s3-ap-southeast-1.amazonaws.com

echo 'cp file to s3://awesome-builder-infra/VPC.yaml'
aws s3 cp $FILE_PATH/VPC.yaml s3://awesome-builder-infra/VPC.yaml
echo 'updating stack'
aws cloudformation update-stack --stack-name $STACK_NAME --template-url $S3_HTTP_URI/VPC.yaml --parameters "$(cat $FILE_PATH/parameters.json)" --output text
echo 'waiting for stack to be updated'
aws cloudformation wait stack-update-complete --stack-name $STACK_NAME
echo 'stack updated'
