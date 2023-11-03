// CODE

import { it } from "vitest";
import { z } from "zod";
import { Equal, Expect } from "./helpers/type-utils";

// 解1: fetch提供側で型を指定することで呼び出す側に制約をつける
// const genericFetch = (url: string, schema: z.ZodSchema<{ name: string }>) => {

// 解2: 呼び出し側で期待する型を渡すことで、その渡された型にparseされることを期待する
// * fetch先のAPI仕様変更に気付けるようにする、などが目的か？
const genericFetch = <ZodSchema extends z.ZodSchema>(url: string, schema: ZodSchema): Promise<z.infer<ZodSchema>> => {
  //                 ^ 🕵️‍♂️
  return fetch(url)
    .then((res) => res.json())
    .then((result) => schema.parse(result));
};

// TESTS

it("Should fetch from the Star Wars API", async () => {
  const result = await genericFetch(
    "https://www.totaltypescript.com/swapi/people/1.json",
    z.object({
      name: z.string(),
    }),
  );

  type cases = [
    // Result should equal { name: string }, not any
    Expect<Equal<typeof result, { name: string }>>,
  ];
});
