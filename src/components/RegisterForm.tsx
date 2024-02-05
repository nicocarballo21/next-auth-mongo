/* eslint-disable no-console */
"use client";
import type {SubmitHandler} from "react-hook-form";

import {Input, Button, Chip} from "@nextui-org/react";
import React, {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useRouter} from "next/navigation";

interface Inputs {
  name: string;
  email: string;
  password: string;
}

interface IresStatus {
  status: "success" | "error" | "";
  message: string;
}

const schema = yup
  .object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(4).max(20).required(),
  })
  .required();

export default function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    clearErrors,
    setValue,
    formState: {errors},
  } = useForm<Inputs>({
    defaultValues: {
      name: "",
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

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data, "data");
    ("use server");

    setResStatus({
      status: "",
      message: "",
    });
    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resJson = await res.json();

      if (resJson.error) {
        setResStatus({
          status: "error",
          message: resJson.error,
        });

        return;
      }
      setResStatus({
        status: "success",
        message: resJson.success,
      });

      router.push("/login");
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
          name="name"
          render={({field}) => (
            <Input
              {...field}
              isClearable
              classNames={{
                input: "placeholder:text-gray",
                inputWrapper: ["border border-purple-400 rounded-lg text-white"],
                errorMessage: "text-sm",
              }}
              errorMessage={errors.name?.message}
              isInvalid={!!errors.name?.message}
              label="Name"
              labelPlacement="outside"
              placeholder="Enter your name"
              type="text"
              variant="bordered"
              onClear={() => {
                clearErrors("name");
                setValue("name", "");
              }}
              {...(register("name"),
              {
                required: true,
                maxLength: 20,
              })}
            />
          )}
        />

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
            <Chip className="w-full" color={resStatus.status === "error" ? "danger" : "success"}>
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
            Register
          </Button>
        </footer>
      </form>
    </section>
  );
}
