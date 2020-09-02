import React, { useContext } from 'react';

import { Card, Icon, Label, Image, Button } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';

export default function PostCard({
  post: { id, body, createdAt, username, likesCount, commentsCount, likes },
}) {
  const { user } = useContext(AuthContext);

  function onLikePost() {}

  return (
    <Card fluid>
      <Card.Content>
        <Image floated="left" size="mini" src="https://picsum.photos/200" />
        {user && user.username === username && (
          <Icon
            name="trash"
            floated="right"
            color="red"
            style={{ margin: 0, display: 'block', float: 'right', cursor: 'pointer' }}
            onClick={() => console.log('clocled')}
          />
        )}
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(Number(createdAt)).fromNow()}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likesCount }}></LikeButton>
        <Button as="div" floated="right" labelPosition="right" as={Link} to={`/posts/${id}`}>
          <Button color="blue" basic>
            <Icon name="comments" />
          </Button>
          <Label as="a" basic color="blue" pointing="left">
            {commentsCount}
          </Label>
        </Button>
      </Card.Content>
    </Card>
  );
}
