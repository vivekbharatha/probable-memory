import React from 'react';

import { Card, Icon, Label, Image, Button } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';

export default function PostCard({
  post: { id, body, createdAt, username, likesCount, commentsCount, likes },
}) {
  function onLikePost() {}

  function onCommentPost() {}

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(Number(createdAt)).fromNow()}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button as="div" labelPosition="right" onClick={onLikePost}>
          <Button color="blue" basic>
            <Icon name="heart" />
          </Button>
          <Label as="a" basic color="blue" pointing="left">
            {likesCount}
          </Label>
        </Button>
        <Button as="div" floated="right" labelPosition="right" onClick={onCommentPost}>
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
