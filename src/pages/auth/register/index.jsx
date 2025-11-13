import React from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { roleOptions } from "@/constant/data";

import TextInput from "@/components/ui/TextInput";
import Notification from "@/components/ui/Notification";
import API from "@/services";

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
  role: yup.object().required("Please select a role"),
});

const UserRegistration = () => {
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: "",
      role: null,
    },
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        username: data.username,
        password: data.password,
        role: data.role.value,
      };

      const response = await API.private.onboarding_userRegister(payload);
      if (response.data.message === "Welcome onboard Eran Neww (customer)") {
        Notification.success("Registration successful!");
        reset();
      } else {
        Notification.error("Login failed!");
      }
    } catch (error) {
      Notification.error("Registration failed!");
      throw new error();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          User Registration
        </h2>

        {/* Username Field */}
        <div className="mb-4">
          <TextInput
            label="Username"
            placeholder="Enter your username"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <TextInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Role Select */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Role
          </label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={roleOptions}
                placeholder="Select role..."
              />
            )}
          />
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition cursor-pointer disabled:opacity-60"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default UserRegistration;
