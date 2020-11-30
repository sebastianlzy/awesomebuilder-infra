STACK_NAME=VPC
FILE_PATH=~/workplace/awesomebuilder/infra/vpc

echo 'cp file to s3://awesome-builder-infra/VPC.yaml'
aws s3 cp $FILE_PATH/VPC.yaml s3://awesome-builder-infra/VPC.yaml
echo "creating stack $STACK_NAME"
aws cloudformation create-stack --stack-name $STACK_NAME --template-url https://awesome-builder-infra.s3-ap-southeast-1.amazonaws.com/VPC.yaml --parameters "$(cat $FILE_PATH/parameters.json)"
echo 'waiting for stack to be created'
aws cloudformation wait stack-create-complete --stack-name $STACK_NAME
echo 'stack created'