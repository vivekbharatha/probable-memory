import React, { useState, useContext } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { useForm } from '../utils/hooks';
import { AuthContext } from '../context/auth';

export default function Login(props) {
  const context = useContext(AuthContext);

  const [errors, setErrors] = useState({});
  const { onChange, onSubmit, values } = useForm(loginUser, {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [_loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      props.history.push('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function loginUser() {
    _loginUser();
  }

  return (
    <div className="register-wrapper">
      <h1>Login</h1>
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <Form.Input
          label="Username"
          placeholder="Username"
          name="username"
          value={values.username}
          onChange={onChange}
          type="text"
          error={!!errors.username}
        />
        <Form.Input
          label="Password"
          placeholder="Password"
          name="password"
          value={values.password}
          onChange={onChange}
          type="password"
          error={!!errors.password}
        />
        <Button type="submit" primary>
          Login
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

const LOGIN_USER = gql`
  mutation register($username: String!, $password: String!) {
    login(loginInput: { username: $username, password: $password }) {
      id
      email
      username
      createdAt
      token
    }
  }
`;
