import React, { useContext, useState } from 'react';
import { Form, Button, Message } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useForm } from '../utils/hooks';
import { AuthContext } from '../context/auth';

export default function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState('');

  const { onSubmit, onChange, values } = useForm(loginUserCallback, {
    username: '',
    password: '',
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      props.history.push('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Login</h1>
        <Form.Input
          type='text'
          label='Username'
          placeholder='Username...'
          name='username'
          value={values.username}
          onChange={onChange}
          error={errors.username && true}
        />

        <Form.Input
          type='password'
          label='Password'
          placeholder='Password...'
          name='password'
          value={values.password}
          onChange={onChange}
          error={errors.password && true}
        />
        <Button type='submit' primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <Message
          error
          header='There were some errors with your submission'
          list={Object.values(errors)}
        />
      )}
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;
