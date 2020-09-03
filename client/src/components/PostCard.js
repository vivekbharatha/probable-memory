import React, { useContext } from 'react';

import { Card, Icon, Label, Image, Button, Popup } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';

export default function PostCard({
  post: { id, body, createdAt, username, likesCount, commentsCount, likes },
}) {
  const { user } = useContext(AuthContext);

  return (
    <Card fluid>
      <Card.Content>
        <Image floated="left" size="mini" src="https://picsum.photos/200" />
        {user && user.username === username && <DeleteButton postId={id} />}
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(Number(createdAt)).fromNow()}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likesCount }} />
        <Popup
          content="Comment on this post"
          inverted
          trigger={
            <Button floated="right" labelPosition="right" as={Link} to={`/posts/${id}`}>
              <Button color="blue" basic>
                <Icon name="comments" />
              </Button>
              <Label basic color="blue" pointing="left">
                {commentsCount}
              </Label>
            </Button>
          }
        />
      </Card.Content>
    </Card>
  );
}
