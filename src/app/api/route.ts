// https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
function iteratorToStream(iterator: any) {
    return new ReadableStream({
      async pull(controller) {
        const { value, done } = await iterator.next()

        if (done) {
          controller.close()
        } else {
          controller.enqueue(value)
        }
      },
    })
  }

  function sleep(time: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, time)
    })
  }

  const encoder = new TextEncoder()

  async function* makeIterator() {
    yield encoder.encode('<p>One</p>')
    await sleep(1000)
    yield encoder.encode('<p>Two</p>')
    await sleep(1000)
    yield encoder.encode('<p>Three</p>')
  }

  export async function GET() {
    const iterator = makeIterator()
    const stream = iteratorToStream(iterator)

    return new Response(stream)
  }

// import { NextRequest, NextResponse } from "next/server";

// export async function GET() {
//     const response = await fetch('https://api.vercel.app/blog')
//     const data: string = await response.json()
//     console.log(data)

//     // Create a readable stream
//     const stream = new ReadableStream({
//         start(controller) {
//         const encoder = new TextEncoder();
//         const text = encoder.encode(data);
//         controller.enqueue(text);
//         controller.close();
//         },
//     });

//     return new NextResponse(stream);
// }
