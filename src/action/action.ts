"use server";

import { zodErrToString } from "@/lib/myFunction";
import { loginSchema } from "@/schema/schema";
import { z } from "zod";

type ErrorData = {
  message: string;
  code: string | number;
};

export type ActionRes<T> =
  | { response: "success"; data: T }
  | ({ response: "error" } & ErrorData);

export const submitLogin = async (
  initialState: ActionRes<z.infer<typeof loginSchema>>,
  body: FormData
) => {
  try {
    const username = body.get("username");
    const password = body.get("password");
    const parse = loginSchema.safeParse({ username, password });

    await new Promise<void>((res) => {
      setTimeout(() => {
        res();
      }, 3000);
    });

    if (!parse.success) {
      const msg = zodErrToString(parse.error.errors);
      return (initialState = {
        response: "error",
        message: msg,
        code: 400,
      });
    }

    console.log("body: ", parse);
    return (initialState = {
      response: "success",
      data: parse.data,
    });
  } catch (error) {
    return (initialState = {
      response: "error",
      message: String(error),
      code: 400,
    });
  }
};
