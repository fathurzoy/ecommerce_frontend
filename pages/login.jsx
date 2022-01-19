import { Input } from "@chakra-ui/input";
import { Container } from "@chakra-ui/layout";
import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { useState } from "react/cjs/react.development";

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      // console.log(values);
      return handleLogin(values);
    },
  });

  const handleLogin = async (form) => {
    try {
      const config = {
        "Content-type": "Application/json",
      };

      const response = await axios.post(
        "http://localhost:5000/login",
        form,
        config
      );
      console.log(response);

      if (response.data.data.token) {
        window.localStorage.setItem("tokentahu", response.data.data.token);

        router.push("/user");
      }
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      {error && (
        <Alert status="error" mb={2}>
          <AlertIcon />
          Login invalid
        </Alert>
      )}
      <form onSubmit={formik.handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Input Email"
            type="email"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="Input Password"
            type="password"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
        </FormControl>

        <Button
          colorScheme="whatsapp"
          my={5}
          width="100%"
          type="submit"
          isLoading={formik.isSubmitting}
        >
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;
