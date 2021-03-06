import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { CommentState, PhotoCarouselState, PhotosType } from '../types';
import { Comment, Photo } from '../../api/entities';
import { addAccessedPhoto } from '../../api/requests/photo';
import { addComment, loadComments } from '../../api/requests/comments';

const initialState: CommentState = {
  comments: [],
  commentSending: false,
  loading: false,
  lastResponseStatus: {
    success: {
      isRequestResult: false,
      message: '',
    },
    error: {
      isRequestResult: false,
      message: '',
      isServerError: false,
    },
  },
};

const dropLastResponseStatus = (state: CommentState) => {
  state.lastResponseStatus = initialState.lastResponseStatus;
}

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    sendComment: (state, action: PayloadAction<Comment>) => {
      state.comments.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadComments.fulfilled, (state, action: PayloadAction<Comment[]>) => {
      state.loading = false;
      state.lastResponseStatus.success.isRequestResult = true;
      if (action.payload) {
        state.comments = action.payload;
      }
    });
    builder.addCase(addComment.fulfilled, (state, action: PayloadAction<Comment>) => {
      state.commentSending = false;
      state.lastResponseStatus.success.isRequestResult = true;
      state.comments.push(action.payload);
    });
    builder.addCase(loadComments.pending, (state) => {
      dropLastResponseStatus(state);
      state.loading = true;
    });
    builder.addCase(addComment.pending, (state) => {
      dropLastResponseStatus(state);
      state.commentSending = true;
    });
    builder.addMatcher(isAnyOf(loadComments.rejected, addComment.rejected), (state, action) => {
      state.loading = false;
      state.commentSending = false;
      state.lastResponseStatus.error.isRequestResult = true;
      if (action.payload) {
        state.lastResponseStatus.error.message = action.payload.error;
        state.lastResponseStatus.error.isServerError = action.payload.isServerError || false;
      }
    });
  }
});

export const {
  sendComment,
} = commentSlice.actions;

export default commentSlice.reducer;
