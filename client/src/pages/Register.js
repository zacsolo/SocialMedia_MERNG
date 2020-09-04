import React, { useState } from 'react';
import { Form, Button, Message } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useForm } from '../utils/hooks';
export default function Register(props) {
  const [errors, setErrors] = useState('');

  const { onSubmit, onChange, values } = useForm(registerUser, {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, result) {
      props.history.push('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function registerUser() {
    addUser();
  }

  return (
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Register</h1>
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
          type='email'
          label='Email'
          placeholder='Email...'
          name='email'
          value={values.email}
          onChange={onChange}
          error={errors.email && true}
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
        <Form.Input
          type='password'
          label='Confirm Password'
          placeholder='Confirm Password...'
          name='confirmPassword'
          value={values.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword && true}
        />
        <Button type='submit' primary>
          Register
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
