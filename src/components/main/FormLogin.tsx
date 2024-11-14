"use client";
import React, { useActionState, useEffect, useRef, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { submitLogin } from "@/action/action";
import { loginSchema } from "@/schema/schema";
import { AlertCircle, Check } from "lucide-react";

const defaultValues: z.infer<typeof loginSchema> = {
  username: "",
  password: "",
};

const FormLogin = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();
  const [state, formAction, isPending] = useActionState(submitLogin, {
    response: "success",
    data: defaultValues,
  });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    startTransition(() => {
      formAction(new FormData(formRef.current!));
    });
  }

  useEffect(() => {
    if (state.data?.username) {
      form.reset();
    }
  }, [state, form]);

  return (
    <div>
      {state.response === "success" ? (
        <>
          {state.data.username ? (
            <Alert>
              <Check className="h-4 w-4" />
              <AlertTitle>Hello!</AlertTitle>
              <AlertDescription>{state.data.username}</AlertDescription>
            </Alert>
          ) : null}
        </>
      ) : null}
      {state.response === "error" ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}
      <Form {...form}>
        <form
          ref={formRef}
          action={formAction}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="input your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="input password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            Submit{isPending ? ".." : ""}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FormLogin;
