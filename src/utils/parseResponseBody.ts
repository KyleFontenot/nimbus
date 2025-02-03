// export async function parseBody(request: Request) {
//   const contentType = request.headers.get('Content-Type');
//   // console.log(contentType)
//   if (contentType !== ('application/json' || 'multipart/form-data')) {
//     return;
//   }
//   let body: Record<any, any> | FormData | undefined = undefined;
//   if (contentType === 'application/json') {
//     body = await request.json();
//   } else if (contentType === 'multipart/form-data') {
//     const _f = await request.formData();
//     body = Object.fromEntries(_f.entries());
//   }
//   return body;
// }

