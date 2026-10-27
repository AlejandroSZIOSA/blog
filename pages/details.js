const USER_ID = 5;
let tempComments = [];

const btnBackEl = document.querySelector("#backBtn");

const messageDivEl = document.querySelector("#messages");
const contentDivEl = document.querySelector("#content");

const postTitleH3El = document.querySelector("#postTitle");
const postDescriptionPEl = document.querySelector("#postDescription");

const deleteBtnEl = document.querySelector("#deleteBtn");

const commentFormEl = document.querySelector("#commentForm");
const commentTextareaEl = document.querySelector("#newComment");

const commentListEl = document.querySelector("#commentList");

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

btnBackEl.addEventListener("click", () => {
  /*   console.log("click");
   */ window.location.href = "../index.html";
  /*   window.history.back(); */
});

commentFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(commentFormEl);
  const data = Object.fromEntries(formData.entries());
  addComment(data);
});

deleteBtnEl.addEventListener("click", () => {
  deletePost();
});

const getPostDetails = async function () {
  try {
    const [resComments, resPosts] = await Promise.all([
      fetch(`https://dummyjson.com/comments/${postId}`),
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

    renderMessages(`Error: ${e.message}`);
  } finally {
    console.log("operation fetches details completed");
  }
};

async function addComment(formData) {
  try {
    const res = await fetch("https://dummyjson.com/comments/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body: formData.newComment,
        postId: postId,
        userId: USER_ID, // just for testing, use a unique userId
      }),
    });
    const data = await res.json();

    console.log(data);
    commentTextareaEl.value = "";

    addNewTempComment({
      postIdTemp: postId,
      userNameTemp: "Unknown",
      commentContentTemp: formData.newComment,
    });

    renderTempComments();
  } catch (e) {
    console.log(e.message);

    renderMessages(`Error: ${e.message}`);
  } finally {
    console.log("POST new comment success");
  }
}
// TODO: add a function to edit the post, and call it when the user clicks on the edit button. The function should send a PUT request to the API with the new post data.

async function updatePost(editedPostData) {
  try {
    const res = await fetch("https://dummyjson.com/posts/" + postId, {
      method: "PUT", // or PATCH
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "I think I should shift to the moon",
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const data = await res.json();

    console.log(data);
  } catch (error) {
    console.error("Error updating post:", error.message);
  }
}

async function deletePost() {
  try {
    const res = await fetch("https://dummyjson.com/posts/" + postId, {
      method: "DELETE",
    });

    const data = await res.json();
    renderMessages("Post deleted successfully");
    console.log(data);
  } catch (e) {
    console.log(e.message);
  } finally {
    console.log("DELETE comment completed");
  }
}

function renderPageInfo(comment, post) {
  const { title, body: postDescription, id } = post;
  const { user, body: commentContent } = comment;

  postTitleH3El.textContent = title;
  postDescriptionPEl.textContent = postDescription;

  const newTempCommentData = {
    postIdTemp: id,
    userNameTemp: user.username,
    commentContentTemp: commentContent,
  };
  addNewTempComment(newTempCommentData);
  renderTempComments();
}

function addNewTempComment({ postIdTemp, userNameTemp, commentContentTemp }) {
  tempComments.push({
    postIdTemp: postIdTemp,
    userNameTemp: userNameTemp,
    commentTemp: commentContentTemp,
  });
  console.log(tempComments);
}

function renderTempComments() {
  commentListEl.innerHTML = "";
  tempComments.forEach((comment) => {
    const { userNameTemp, commentTemp } = comment;
    const listItemEl = document.createElement("li");
    listItemEl.innerHTML = `
      <h3>${userNameTemp}</h3>
      <p>${commentTemp}</p>
    `;
    commentListEl.appendChild(listItemEl);
  });
}

function renderMessages(message) {
  messageDivEl.innerHTML = `<p>${message}</p>
  <button id="continueBtn">Continue</button>
  `;
  messageDivEl.classList.remove("disabled");
  contentDivEl.classList.add("disabled");

  const continueBtnEl = document.querySelector("#continueBtn");
  continueBtnEl.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
}

getPostDetails();
