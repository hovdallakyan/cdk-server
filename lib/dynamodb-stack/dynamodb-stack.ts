import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from 'constructs';
import { join } from 'path';

export class DynamoDBStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the Products table
    const productsTable = new dynamodb.Table(this, 'ProductsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'products',
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    // Create the Stock table
    const stockTable = new dynamodb.Table(this, 'StockTable', {
      partitionKey: { name: 'product_id', type: dynamodb.AttributeType.STRING },
      tableName: 'stock',
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    // // Optionally, output the table names to the CloudFormation output
    // new cdk.CfnOutput(this, 'ProductsTableName', {
    //   value: productsTable.tableName,
    // });

    // new cdk.CfnOutput(this, 'StockTableName', {
    //   value: stockTable.tableName,
    // });

    const addTodoLambdaProduct = new lambda.Function(this, 'add-product', {
        runtime: lambda.Runtime.NODEJS_20_X,
        memorySize: 1024,
        timeout: cdk.Duration.seconds(5),
        handler: 'handler.addProduct',
        code: lambda.Code.fromAsset(join(__dirname, './')),
        environment: {
          TABLE_NAME: 'products'
        }
      });

      productsTable.grantWriteData(addTodoLambdaProduct);

      const addTodoLambdaStock = new lambda.Function(this, 'add-stock', {
        runtime: lambda.Runtime.NODEJS_20_X,
        memorySize: 1024,
        timeout: cdk.Duration.seconds(5),
        handler: 'handler.addStock',
        code: lambda.Code.fromAsset(join(__dirname, './')),
        environment: {
          TABLE_NAME: 'stock'
        }
      });

      stockTable.grantWriteData(addTodoLambdaStock);

  }
}
