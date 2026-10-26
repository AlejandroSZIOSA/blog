const postTitleH3El = document.querySelector("#postTitle");
const postDescriptionPEl = document.querySelector("#postDescription");

const userNameH3El = document.querySelector("#userName");
const userComentPEl = document.querySelector("#userComment");
const btnBackEl = document.querySelector("#backBtn");

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

btnBackEl.addEventListener("click", () => {
  console.log("click");
  window.location.href = "../index.html";
  /*   window.history.back(); */
});

const getPostDetails = async function () {
  try {
    const [resComments, resPosts] = await Promise.all([
      fetch(`https://dummyjson.com/commnts/${postId}`),
      fetch(`https://dummyjson.com/posts/${postId}`),
    ]);

    const [commentsData, postData] = await Promise.all([
      resComments.json(),
      resPosts.json(),
    ]);

    console.log(commentsData);
    renderPageInfo(commentsData, postData);
  } catch (e) {
    console.error(e.message);
  } finally {
    console.log("operation fetches details completed");
  }
};

async function addComment() {
  try {
    const res = await fetch("https://dummyjson.com/comments/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body: "This makes all sense to me!",
        postId: 3,
        userId: 5,
      }),
    });
    s;
    const data = await res.json();
    console.log(data);
  } catch (e) {
    console.log(e.message);
  } finally {
    console.log("POST new comment success");
  }
}

async function updateComment() {
  try {
    const res = await fetch("https://dummyjson.com/comments/1", {
      method: "PUT", // or PATCH
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body: "I think I should shift to the moon",
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const data = await res.json();
    console.log(data);
  } catch (e) {
    console.log(e.message);
  } finally {
    console.log("PUT comment update completed");
  }
}

async function deleteComment() {
  try {
    const res = await fetch("https://dummyjson.com/comments/1", {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const data = await res.json();
    console.log(data);
  } catch (e) {
    console.log(e.message);
  } finally {
    console.log("DELETE comment completed");
  }
}

function renderPageInfo(comment, post) {
  const { title, body: postDescription } = post;
  const { user, body: commentContent } = comment;

  postTitleH3El.textContent = title;
  postDescriptionPEl.textContent = postDescription;

  userNameH3El.textContent = user.fullName;
  userComentPEl.textContent = commentContent;
}

getPostDetails();
