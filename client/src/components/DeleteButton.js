import React, { useState } from 'react';
import { Icon, Confirm } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { FETCH_POSTS_QUERY } from '../utils/graphql';

export default function DeleteButton({ postId, onDeleted }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [onDeletePost] = useMutation(DELETE_POST_MUTATION, {
    variables: { postId },
    update(proxy) {
      setConfirmOpen(false);

      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: { getPosts: data.getPosts.filter((p) => p.id !== postId) },
      });
      if (onDeleted) onDeleted();
    },
    onError(err) {},
  });

  return (
    <>
      <Icon
        name="trash"
        floated="right"
        color="red"
        style={{ margin: 0, display: 'block', float: 'right', cursor: 'pointer' }}
        onClick={() => setConfirmOpen(true)}
      />
      <Confirm
        open={confirmOpen}
        onConfirm={onDeletePost}
        onCancel={() => {
          setConfirmOpen(false);
        }}
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;
