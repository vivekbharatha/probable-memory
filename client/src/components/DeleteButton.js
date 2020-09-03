import React, { useState } from 'react';
import { Icon, Confirm, Popup } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { FETCH_POSTS_QUERY } from '../utils/graphql';

export default function DeleteButton({ postId, commentId, onDeleted }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [onDeletePostOrComment] = useMutation(mutation, {
    variables: { postId, commentId },
    update(proxy) {
      setConfirmOpen(false);

      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: { getPosts: data.getPosts.filter((p) => p.id !== postId) },
        });
        if (onDeleted) onDeleted();
      } else {
      }
    },
    onError(err) {},
  });

  return (
    <>
      <Popup
        content={commentId ? 'Delete this comment' : 'Delete this post'}
        inverted
        trigger={
          <Icon
            name="trash"
            floated="right"
            color="red"
            style={{ margin: 0, display: 'block', float: 'right', cursor: 'pointer' }}
            onClick={() => setConfirmOpen(true)}
          />
        }
      />

      <Confirm
        open={confirmOpen}
        onConfirm={onDeletePostOrComment}
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

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        body
        username
        createdAt
      }
      commentsCount
    }
  }
`;
