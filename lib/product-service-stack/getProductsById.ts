import { products } from './mock-product-data';

export async function main(event: { pathParameters: { productId: any; }; }) {
    const { productId } = event.pathParameters;

    const product = products.find(p => p.id === productId);

    return {
        statusCode: product ? 200 : 404,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        body: JSON.stringify(product || { message: 'Product not found' })
    };
};
