export default function getUrlComponents(url: string | URL) {
	let _url: string = url instanceof URL ? url.toString() : url;

	// Regex to match path segments and query parameters
	const regex = /\/([^\/?]+)(?:\?([^#]*))?/g;

	// Initialize arrays and object for results
	const pathNames: Array<string> = [];
	const queryParams = {};

	// Match all path segments
	const pathMatches = [..._url.matchAll(regex)];
	for (let match of pathMatches) {
		pathNames.push(match[1]);
	}

	// Match query parameters
	const queryStringMatch = /[?]([^#]*)/.exec(_url);
	if (queryStringMatch?.[1]) {
		const queryString = queryStringMatch[1];
		const queryRegex = /([^&=]+)=([^&]*)/g;
		const queryMatches = [...queryString.matchAll(queryRegex)];
		for (let match of queryMatches) {
			queryParams[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
		}
	}
	return { pathNames: pathNames, queryParams: queryParams };
}
