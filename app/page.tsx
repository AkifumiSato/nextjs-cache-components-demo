"use cache";

import { cacheLife } from "next/cache";

export default async function Page() {
  cacheLife("seconds");

  const todo = await fetch("https://dummyjson.com/todos/random").then((res) =>
    res.json(),
  );

  return (
    <div>
      <h1>Hello, Next.js!</h1>
      <pre>
        <code>{JSON.stringify(todo)}</code>
      </pre>
    </div>
  );
}
