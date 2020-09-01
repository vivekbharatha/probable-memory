import React from 'react';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Grid } from 'semantic-ui-react';
import PostCard from '../components/PostCard';

const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
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
        username
        createdAt
        body
      }
    }
  }
`;

export default function Home() {
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  const posts = data ? data.getPosts : [];
  return (
    <Grid columns={1} className="posts-wrapper">
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h2>Loading posts...</h2>
        ) : (
          posts &&
          posts.map((post) => {
            return (
              <Grid.Column key={post.id} style={{ marginBottom: 30 }}>
                <PostCard post={post} />
              </Grid.Column>
            );
          })
        )}
      </Grid.Row>
    </Grid>
  );
}
