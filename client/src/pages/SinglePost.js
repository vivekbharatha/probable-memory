import React, { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag';
import moment from 'moment';
import { Grid, Image, Card, Button, Icon, Label, Form } from 'semantic-ui-react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import { Link } from 'react-router-dom';
import DeleteButton from '../components/DeleteButton';

export default function SinglePost(props) {
  const postId = props.match.params.postId;

  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState('');

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const commentInputRef = useRef(null);

  const [submitComment] = useMutation(COMMENT_MUTATION, {
    update() {
      commentInputRef.current.blur();
      setComment('');
    },
    variables: {
      postId,
      body: comment,
    },
  });

  function onDeleted() {
    props.history.push('/');
  }

  let postMarkup;
  if (!data) {
    postMarkup = <p>Loading post....</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likesCount,
      commentsCount,
    } = data.getPost;

    postMarkup = (
      <Grid>
        <Grid.Row centered>
          <Grid.Column width={11}>
            <Card fluid>
              <Card.Content>
                <Image floated="left" size="mini" src="https://picsum.photos/200" />
                {user && user.username === username && (
                  <DeleteButton postId={id} onDeleted={onDeleted} />
                )}
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(Number(createdAt)).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likesCount }} />
                <Button floated="right" labelPosition="right" as={Link} to={`/posts/${id}`}>
                  <Button color="blue" basic>
                    <Icon name="comments" />
                  </Button>
                  <Label basic color="blue" pointing="left">
                    {commentsCount}
                  </Label>
                </Button>
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input field">
                      <input
                        type="text"
                        placeholder="comment...."
                        name="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        ref={commentInputRef}
                      ></input>
                      <button
                        type="submit"
                        className="ui button blue"
                        disabled={comment.trim() === ''}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} onDeleted={onDeleted} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(Number(comment.createdAt)).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return <div>{postMarkup}</div>;
}

const COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentsCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likesCount
      commentsCount
      likes {
        username
      }
      comments {
        id
        body
        username
        createdAt
      }
    }
  }
`;
