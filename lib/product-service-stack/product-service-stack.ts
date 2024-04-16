import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import { Construct } from 'constructs';

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const getProductsList = new lambda.Function(this, 'GetProductsList', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset(path.join(__dirname, './')),
      handler: 'getProductsList.main' // file is `getProductsList.js` and handler function is `handler`
    });

    const getProductsById = new lambda.Function(this, 'GetProductsById', {
        runtime: lambda.Runtime.NODEJS_20_X,
        code: lambda.Code.fromAsset(path.join(__dirname, './')),
        handler: 'getProductsById.main'
    });

    const api = new apigateway.RestApi(this, 'productsApi', {
      restApiName: 'Product Service API'
    });

    const productsResource = api.root.addResource('products');
    productsResource.addMethod('GET', new apigateway.LambdaIntegration(getProductsList));
    productsResource.addCorsPreflight({
        allowOrigins: ['https://dqzafs7lo44d.cloudfront.net', 'http://localhost:3000'],
        allowMethods: ['GET'],
      });

    const singleProductResource = productsResource.addResource('{productId}');
    singleProductResource.addMethod('GET', new apigateway.LambdaIntegration(getProductsById));
    singleProductResource.addCorsPreflight({
        allowOrigins: ['https://dqzafs7lo44d.cloudfront.net', 'http://localhost:3000'],
        allowMethods: ['GET'],
      });
  }
}
