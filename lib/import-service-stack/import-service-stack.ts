import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3n  from 'aws-cdk-lib/aws-s3-notifications';
import * as path from 'path';
import { Construct } from 'constructs';

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'ImportBucket', {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
      
    bucket.addLifecycleRule({ 
        prefix: 'uploaded/',
        transitions: [{ storageClass: s3.StorageClass.INFREQUENT_ACCESS, transitionAfter: cdk.Duration.days(30) }]
    });

    const importFunction = new lambda.Function(this, 'importProductsFile', {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'handler.importProductsFile',
        code: lambda.Code.fromAsset(path.join(__dirname, './')),
      });

    bucket.grantReadWrite(importFunction);

    const api = new apigateway.RestApi(this, 'ImportServiceApi', {
        restApiName: 'Product Import Service',
      });
      
    const importResource = api.root.addResource('import');
    importResource.addMethod('GET', new apigateway.LambdaIntegration(importFunction));

    // -

    const parserFunction = new lambda.Function(this, 'importFileParser', {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'handler.importFileParser',
        code: lambda.Code.fromAsset(path.join(__dirname, './')),
        environment: {
          BUCKET: bucket.bucketName,
        },
      });
      
      bucket.grantRead(parserFunction);
      bucket.addEventNotification(
            s3.EventType.OBJECT_CREATED,
            new s3n.LambdaDestination(parserFunction),
            { prefix: 'uploaded/' }
        )
    }
}

