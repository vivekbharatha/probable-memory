import React, { useContext } from 'react';
import gql from 'graphql-tag';
import moment from 'moment';
import { Grid, Image, Card, Button, Icon, Label } from 'semantic-ui-react';
import { useQuery } from '@apollo/react-hooks';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import { Link } from 'react-router-dom';
import DeleteButton from '../components/DeleteButton';

export default function SinglePost(props) {
  const postId = props.match.params.postId;

  const { user } = useContext(AuthContext);

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
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
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return <div>{postMarkup}</div>;
}

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
        body
        username
        createdAt
      }
    }
  }
`;
