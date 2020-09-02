import React, { useContext } from 'react';

import { useQuery } from '@apollo/react-hooks';

import { Grid } from 'semantic-ui-react';
import PostCard from '../components/PostCard';
import { AuthContext } from '../context/auth';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from '../utils/graphql';

export default function Home() {
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  const { user } = useContext(AuthContext);

  const posts = data ? data.getPosts : [];
  return (
    <Grid columns={1} className="posts-wrapper">
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user ? (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        ) : (
          ''
        )}
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
