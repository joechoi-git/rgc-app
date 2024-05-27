/*
// https://v936r8sd70.execute-api.us-west-2.amazonaws.com/Prod/concepts
async function fetchMoviesBadStatus() {
    const response = await fetch('/oops');
  
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
  
    const movies = await response.json();
    return movies;
  }
  
  fetchMoviesBadStatus().catch(error => {
    error.message; // 'An error has occurred: 404'
  });

*/
interface HttpResponse<T> extends Response {
    parsedBody?: T;
}

export async function http<T>(request: RequestInfo): Promise<HttpResponse<T>> {
    const response: HttpResponse<T> = await fetch(request);

    try {
        // const body = await response.json();
        response.parsedBody = await response.json();
    } catch (err) {
        console.error(err);
    }

    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response;
}

export async function get<T>(
    path: string,
    args: RequestInit = { method: "get" }
): Promise<HttpResponse<T>> {
    return await http<T>(new Request(path, args));
}

export async function post<T>(
    path: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // body: any,
    body: unknown,
    args: RequestInit = { method: "post", body: JSON.stringify(body) }
): Promise<HttpResponse<T>> {
    return await http<T>(new Request(path, args));
}

export async function put<T>(
    path: string,
    body: unknown,
    args: RequestInit = { method: "put", body: JSON.stringify(body) }
): Promise<HttpResponse<T>> {
    return await http<T>(new Request(path, args));
}

/*
// example consuming code
const response = await post<{ id: number }>("https://jsonplaceholder.typicode.com/posts", {
    title: "my post",
    body: "some content"
});
*/
