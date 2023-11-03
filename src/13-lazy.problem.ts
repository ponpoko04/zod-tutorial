// CODE

import { expect, it } from "vitest";
import { z } from "zod";

// const MenuItem = z.object({
//   //             ^ 🕵️‍♂️
//   link: z.string(),
//   label: z.string(),
//   children: z.array(MenuItem).default([]),
// });

// 解1
// interface MenuItem {
//   link: string;
//   label: string;
//   children?: Array<MenuItem>;
// }
// const MenuItem: z.ZodType<MenuItem> = z.lazy(() =>
//   z.object({
//     link: z.string(),
//     label: z.string(),
//     children: z.array(MenuItem).default([]),
//   })
// );

// 解2
const MenuItemSchema = z.object({
  link: z.string(),
  label: z.string(),
});
type MenuItem = z.infer<typeof MenuItemSchema> & {
  children?: MenuItem[],
};
const MenuItem: z.ZodType<MenuItem> = MenuItemSchema.extend({
  children: z.lazy(() => MenuItem.array().default([]))
});

// TESTS

it("Should succeed when it encounters a correct structure", async () => {
  const menuItem = {
    link: "/",
    label: "Home",
    children: [
      {
        link: "/somewhere",
        label: "Somewhere",
        children: [],
      },
    ],
  };
  expect(MenuItem.parse(menuItem)).toEqual(menuItem);
});

it("Should succeed when it encounters an no children structure", async () => {
  const menuItem = {
    link: "/",
    label: "Home",
  };
  const expectedParsedMenuItem = {
    link: "/",
    label: "Home",
    children: [],
  };
  expect(MenuItem.parse(menuItem)).toEqual(expectedParsedMenuItem);
});

it("Should error when it encounters an incorrect structure", async () => {
  const menuItem = {
    children: [
      {
        link: "/somewhere",
        label: "Somewhere",
        children: [],
      },
    ],
  };
  expect(() => MenuItem.parse(menuItem)).toThrowError();
});
