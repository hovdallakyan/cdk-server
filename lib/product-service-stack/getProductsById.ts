import { products } from './mock-product-data';

export async function main(event: { pathParameters: { productId: any; }; }) {
    const { productId } = event.pathParameters;

    const product = products.find(p => p.id === productId);

    return {
        statusCode: product ? 200 : 404,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(product || { message: 'Product not found' })
    };
};
