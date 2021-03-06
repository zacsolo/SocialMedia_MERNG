import React, { useContext, useState, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {
  Grid,
  Image,
  Card,
  Button,
  Icon,
  Label,
  Form,
} from 'semantic-ui-react';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import DeleteButton from '../components/DeleteButton';
import LikeButton from '../components/LikeButton';
import MyPopup from '../utils/MyPopup';

export default function SinglePost(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);

  const [comment, setComment] = useState('');

  const { loading, error, data } = useQuery(FETCH_POST_QUERY, {
    variables: { postId },
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('');
      commentInputRef.current.blur();
    },
    variables: { postId, body: comment },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  const deletePostCallback = () => {
    props.history.push('/');
  };

  let postMarkup;
  if (!data.getPost) {
    postMarkup = <p>Loading...</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      likeCount,
      likes,
      comments,
      commentCount,
    } = data.getPost;
    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width='2'>
            <Image
              src='https://react.semantic-ui.com/images/avatar/large/molly.png'
              size='small'
              floated='right'
            />
          </Grid.Column>
          <Grid.Column width='10'>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <MyPopup content='Comment on post'>
                  <Button
                    as='div'
                    labelPosition='right'
                    onClick={() => console.log('Comment Button')}>
                    <Button basic color='grey'>
                      <Icon name='comments' />
                    </Button>
                    <Label basic color='grey' labelPosition='left'>
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className='ui action input fluid'>
                      <input
                        type='text'
                        placeholder='comment...'
                        name='comment'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type='submit'
                        className='ui button teal'
                        disabled={comment.trim() === ''}
                        onClick={submitComment}>
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((c) => (
              <Card fluid key={c.id}>
                <Card.Content>
                  {user && user.username === c.username && (
                    <DeleteButton postId={id} commentId={c.id} />
                  )}
                  <Card.Header>{c.username}</Card.Header>
                  <Card.Meta>{moment(c.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{c.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      commentCount
      comments {
        id
        body
        createdAt
        username
      }
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
      likeCount
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
      likes {
        username
      }
    }
  }
`;
