import React from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Box,
  Button,
} from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../InputField";
import { useMutation } from "urql";

interface registerProps {}

const REGISTER_MUT = `
  mutation Register($username: String!, $password: String!){
    register(options: {username: $username, password:$password}){
      errors{
        field
        message      
      }
      user{
        id
        createdAt
        updatedAt
        username
      }
    }
  }
`;

export const Register: React.FC<registerProps> = ({}) => {
  // information about the data -1st parameter
  // register is the function -2nd parameter
  const [, register] = useMutation(REGISTER_MUT);
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values) => {
          // if variables and mutation strings were different:
          const response = await register(values);
          // return  register({ username: values.user });
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Button
              mt={4}
              isLoading={isSubmitting}
              type="submit"
              variantColor="teal"
            >
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
