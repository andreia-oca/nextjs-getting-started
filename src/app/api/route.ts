// export const runtime = 'nodejs'; // This is the default and can be omitted
// export const dynamic = 'force-dynamic'; // always run dynamically

export const runtime = "edge";

// export async function GET() {
//   // This encoder will stream your text
//   const encoder = new TextEncoder();
//   const customReadable = new ReadableStream({
//     start(controller) {
//       // Start encoding 'Basic Streaming Test',
//       // and add the resulting stream to the queue
//       controller.enqueue(encoder.encode('Basic Streaming Test'));
//       // Prevent anything else being added to the stream
//       controller.close();
//     },
//   });

//   return new Response(customReadable, {
//     headers: { 'Content-Type': 'text/html; charset=utf-8' },
//   });
// }


// // A generator that will yield positive integers
// async function* integers() {
//     let i = 1;
//     while (true) {
//       console.log(`yielding ${i}`);
//       yield i++;

//       await sleep(100);
//     }
//   }
//   // Add a custom sleep function to create
//   // a delay that simulates how slow some
//   // Function responses are.
//   function sleep(ms: number) {
//     return new Promise((resolve) => setTimeout(resolve, ms));
//   }
//   // Wraps a generator into a ReadableStream
//   function createStream(iterator: AsyncGenerator<number, void, unknown>) {
//     return new ReadableStream({
//       // The pull method controls what happens
//       // when data is added to a stream.
//       async pull(controller) {
//         const { value, done } = await iterator.next();
//         // done == true when the generator will yield
//         // no more new values. If that's the case,
//         // close the stream.
//         if (done) {
//           controller.close();
//         } else {
//           controller.enqueue(value);
//         }
//       },
//     });
//   }
//   // Demonstrate handling backpressure
//   async function backpressureDemo() {
//     // Set up a stream of integers
//     const stream = createStream(integers());
//     // Read values from the stream
//     const reader = stream.getReader();
//     const loopCount = 5;
//     // Read as much data as you want
//     for (let i = 0; i < loopCount; i++) {
//       // Get the newest value added to the stream
//       const { value } = await reader.read();
//       console.log(`Stream value: ${value}`);
//       await sleep(1000);
//     }
//   }

//   export async function GET() {
//     backpressureDemo();
//     return new Response('Check your console to see the result!');
//   }

import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// This method must be named GET
export async function GET() {
  // Make a request to OpenAI's API based on
  // a placeholder prompt
  const response = await streamText({
    model: openai('gpt-4o-mini'),
    messages: [{ role: 'user', content: 'Generate a one paragraph text up to 100 words.' }],
    onFinish: (event) => {
        console.log("Completed", event.text);
    }
  });
  // Respond with the stream
  return response.toTextStreamResponse({
    headers: {
      'Content-Type': 'text/event-stream',
    },
  });
}

// // https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
// function iteratorToStream(iterator: any) {
//     return new ReadableStream({
//       async pull(controller) {
//         const { value, done } = await iterator.next()

//         if (done) {
//           controller.close()
//         } else {
//           controller.enqueue(value)
//         }
//       },
//     })
//   }

//   function sleep(time: number) {
//     return new Promise((resolve) => {
//       setTimeout(resolve, time)
//     })
//   }

//   const encoder = new TextEncoder()

//   async function* makeIterator() {
//     yield encoder.encode('<p>One</p>')
//     await sleep(1000)
//     yield encoder.encode('<p>Two</p>')
//     await sleep(1000)
//     yield encoder.encode('<p>Three</p>')
//   }

//   export async function GET() {
//     const iterator = makeIterator()
//     const stream = iteratorToStream(iterator)

//     return new Response(stream)
//   }

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
