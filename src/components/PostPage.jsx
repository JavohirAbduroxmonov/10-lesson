import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { editPost } from "../store/postsSlice";
import ClipLoader from "react-spinners/ClipLoader";
import { api } from "../api";

const PostPage = ({ posts, handleDelete }) => {
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const { id } = useParams();
  const post = posts.find((post) => post.id.toString() === id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
    }
  }, [post]);

  async function handleEdit() {
    setLoading(true);
    try {
      await api.put(`/posts/${post.id}`, {
        title,
        body,
      });
      dispatch(editPost({ ...post, title, body }));
      setEdit(false); // Set edit mode to false after successful edit
    } catch (error) {
      console.error("Error editing post:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="PostPage">
      <article className="post">
        {post ? (
          <>
            {edit ? (
              <form onSubmit={handleEdit}>
                <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  rows={5}
                  name="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
                <div className="buttons">
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEdit(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h2>{post.title}</h2>
                <p className="postDate">{post.datetime}</p>
                <p className="postBody">{post.body}</p>
                <div className="buttons">
                  <button
                    className="danger"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </button>
                  <button onClick={() => setEdit(true)}>Edit</button>
                </div>
              </>
            )}
            <ClipLoader
              loading={loading}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
              cssOverride={{ borderColor: "white", marginLeft: "0.2em" }}
            />
          </>
        ) : (
          <>
            <h2>Post Not Found</h2>
            <p>Well, that's disappointing.</p>
            <p>
              <Link to="/">Visit Our Homepage</Link>
            </p>
          </>
        )}
      </article>
    </main>
  );
};

export default PostPage;
