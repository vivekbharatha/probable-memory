import React from 'react';
import { Form, Button } from 'semantic-ui-react';

import { useForm } from '../utils/hooks';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { FETCH_POSTS_QUERY } from '../utils/graphql';

export default function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCB, {
    body: '',
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });

      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: { getPosts: [result.data.createPost, ...data.getPosts] },
      });
      values.body = '';
    },
  });

  function createPostCB() {
    createPost()
      .then(() => {})
      .catch((e) => {
        console.log('-----', e);
      });
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post</h2>
        <Form.Group>
          <Form.Input
            placeholder="Hi World!"
            name="body"
            onChange={onChange}
            value={values.body}
            width={14}
          />
          <Button type="submit" primary width={2}>
            Submit
          </Button>
        </Form.Group>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likesCount
      comments {
        id
        username
        createdAt
      }
      commentsCount
    }
  }
`;
