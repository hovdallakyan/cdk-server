// Import the required AWS SDK clients and commands for JavaScript v3.
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { fromIni } from "@aws-sdk/credential-providers";

// Create a Lambda client object.
const lambda = new LambdaClient({
  region: "eu-central-1",
  credentials: fromIni({ profile: 'default' })
});

async function addProduct(product) {
  const command = new InvokeCommand({
    FunctionName: 'DynamoDBStack-addproductFA8183D0-Pt36c2uCfPu6',
    InvocationType: 'RequestResponse',
    Payload: new TextEncoder().encode(JSON.stringify({ body: JSON.stringify(product) }))
  });

  try {
    const data = await lambda.send(command);
    console.log('Success:', new TextDecoder().decode(data.Payload));
  } catch (err) {
    console.log('Error:', err);
  }
}

async function main() {
  for (let product of products) {
    await addProduct(product);
  }
}

main();
