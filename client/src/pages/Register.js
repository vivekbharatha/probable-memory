import React, { useState } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';

import gql from 'graphql-tag';

export default function Register(props) {
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  function onChange(event) {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  }

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, result) {
      props.history.push('/');
    },
    onError(error) {
      console.log(error.graphQLErrors);
      setErrors(error.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function onSubmit(event) {
    event.preventDefault();
    addUser();
  }

  return (
    <div className="register-wrapper">
      <h1>Register</h1>
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <Form.Field>
          <label>Username</label>
          <input
            placeholder="Username"
            name="username"
            value={values.username}
            onChange={onChange}
            type="text"
          />
        </Form.Field>
        <Form.Field>
          <label>Email</label>
          <input
            placeholder="Email"
            name="email"
            value={values.email}
            onChange={onChange}
            type="email"
          />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <input
            placeholder="Password"
            name="password"
            value={values.password}
            onChange={onChange}
            type="password"
          />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <input
            placeholder="Confirm Password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={onChange}
            type="password"
          />
        </Form.Field>
        <Button type="submit" primary>
          Register
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="">
            {Object.keys(errors).map((err) => {
              return <li key={err}>{errors[err]}</li>;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;
