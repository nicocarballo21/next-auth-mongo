/* eslint-disable no-console */
"use client";
import type {SubmitHandler} from "react-hook-form";

import {Input, Button, Chip} from "@nextui-org/react";
import React, {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {signIn} from "next-auth/react";

interface Inputs {
  email: string;
  password: string;
}

interface IresStatus {
  status: "success" | "error" | "";
  message: string;
}

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(4).max(20).required(),
  })
  .required();

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    control,
    clearErrors,
    setValue,
    formState: {errors},
  } = useForm<Inputs>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });
  const [resStatus, setResStatus] = useState<IresStatus>({
    status: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  // the error messages are copied from somewhere in the NextAuth source code, don't remember where

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    ("use server");

    setResStatus({
      status: "",
      message: "",
    });
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl: "/dashboard",
      });
      const posibleErrors = {
        OAuthAccountNotLinked:
          "To confirm your identity, sign in with the same account you used originally.",
        EmailSignin: "The e-mail could not be sent.",
        CredentialsSignin: "Sign failed. Your credentials are incorrect.",
        SessionRequired: "Please sign in to access this page.",
        default: "Unable to sign in.",
      };

      console.log(res, "res");

      if (res?.error) {
        const errorMessage =
          posibleErrors[res.error as keyof typeof posibleErrors] || posibleErrors.default;

        setResStatus({
          status: "error",
          message: errorMessage,
        });
      }
    } catch (err) {
      console.log("Error registering user", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="grid place-content-center">
      <form className="flex max-w-3xl flex-col items-center justify-center gap-3 rounded-lg bg-gray-800 p-4">
        <Controller
          control={control}
          name="email"
          render={({field}) => (
            <Input
              {...field}
              classNames={{
                input: "placeholder:text-gray",
                inputWrapper: ["border border-purple-400 rounded-lg  text-white"],
                errorMessage: "text-sm",
              }}
              errorMessage={errors.email?.message}
              isInvalid={!!errors.email?.message}
              label="Email"
              labelPlacement="outside"
              placeholder="Enter your email"
              type="email"
              variant="bordered"
              onClear={() => {
                clearErrors("email");
                setValue("email", "");
              }}
              {...register("email", {
                required: true,
              })}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({field}) => (
            <Input
              {...field}
              classNames={{
                input: "placeholder:text-gray",
                inputWrapper: ["border border-purple-400 rounded-lg text-white"],
                errorMessage: "text-sm",
              }}
              errorMessage={errors.password?.message}
              isInvalid={!!errors.password?.message}
              label="Password"
              labelPlacement="outside"
              placeholder="Enter your password"
              type="password"
              variant="bordered"
              onClear={() => {
                clearErrors("password");
                setValue("password", "");
              }}
              {...(register("password"),
              {
                required: true,
                maxLength: 20,
              })}
            />
          )}
        />

        <footer className="mt-5 flex w-full flex-col items-center justify-center gap-2">
          {resStatus.message ? (
            <Chip
              className="w-full"
              color={resStatus.status === "error" ? "danger" : "success"}
              size="sm"
            >
              {resStatus.message}
            </Chip>
          ) : null}

          <Button
            fullWidth
            color="secondary"
            isLoading={isLoading}
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Sign in
          </Button>
        </footer>
      </form>
    </section>
  );
}
