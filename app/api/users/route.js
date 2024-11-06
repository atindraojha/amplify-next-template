export async function GET(request) {
    // Handle GET request
    return new Response(
      JSON.stringify({ message: 'Hello from Next.js API in App Router!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  export async function POST(request) {
    // Handle POST request
    const body = await request.json();
    const { name } = body;
  
    return new Response(
      JSON.stringify({ message: `Hello, ${name}!` }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
  