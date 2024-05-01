import { Handler } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid';

const dynamoDB = new DynamoDBClient({ region: 'eu-central-1' });


export const addProduct: Handler = async (event, context) => {
    const { title, description, price } = JSON.parse(event.body);

    try {
      const command = new PutItemCommand({
        TableName: 'product',
        Item: {
          id: { S: uuidv4() },
          title: { S: title || 'Default Title' },
          description: { S: description || 'No description provided.' },
          price: { N: String(price || 0) }
        }
      });

      const result = await dynamoDB.send(command);
      console.log('PutItem succeeded:', JSON.stringify(result, null, 2));

      // Return a more meaningful response to the API caller
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Product added successfully",
          productId: result.$metadata.requestId  // Example usage of result metadata
        })
      };
    } catch (error) {
        console.error('Error:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Error adding item to DynamoDB table', error: 'error' })
        };
    }
};

export const addStock: Handler = async (event, context) => {
    const { title, description, price } = JSON.parse(event.body);

    try {
      const command = new PutItemCommand({
        TableName: 'stock',
        Item: {
            id: { S: uuidv4() },
            price: { N: String(price || 0) }
        }
      });

      const result = await dynamoDB.send(command);
      console.log('PutItem succeeded:', JSON.stringify(result, null, 2));

      // Return a more meaningful response to the API caller
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Stock added successfully",
          productId: result.$metadata.requestId  // Example usage of result metadata
        })
      };
    } catch (error) {
        console.error('Error:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Error adding item to DynamoDB table', error: 'error'})
        };
    }
};