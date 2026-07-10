export default async function parseBody(request: Request) {
	const contentType: string | null = request.headers.get("Content-Type");
	// console.log(contentType)
	if (
		(contentType as string) !== "application/json" ||
		(contentType as string) !== "multipart/form-data"
	) {
		return;
	}
	let body: Record<any, any> | FormData | undefined = undefined;
	if (contentType === "application/json") {
		body = await request.json();
	} else if (contentType === "multipart/form-data") {
		const _f = await request.formData();
		body = Object.fromEntries(_f.entries());
	}
	return body;
}
