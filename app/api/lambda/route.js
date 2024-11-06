import { API } from 'aws-amplify';

export async function GET(request) {
  try {
    // Call an AWS Lambda function via Amplify API
    const response = await API.get('lambdaApi', '/myLambdaEndpoint');
    return new Response(
      JSON.stringify({ data: response }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to call Lambda function' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}