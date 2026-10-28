const USER_ID = 5;

let tempPost = null;
let tempComments = [];

const btnBackEl = document.querySelector("#backBtn");

const messageDivEl = document.querySelector("#messages");
const contentDivEl = document.querySelector("#content");

const postTitleH3El = document.querySelector("#postTitle");
const postDescriptionPEl = document.querySelector("#postDescription");

const editBtnEl = document.querySelector("#editBtn");
const editPostSectionEl = document.querySelector("#editPostSection");
const editPostFormEl = document.querySelector("#editPostForm");
const editPostTitleInputEl = document.querySelector("#editPostTitleInput");
const editPostContentTextAreaEl = document.querySelector(
  "#editPostContentTextArea",
);
const saveChangesBtnEl = document.querySelector("#saveChangesBtn");

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

editBtnEl.addEventListener("click", () => {
  editPostSectionEl.classList.toggle("enabled");
  /* console.log(editPostSectionEl); */
  editPostTitleInputEl.value = tempPost.title;
  editPostContentTextAreaEl.value = tempPost.body;
});

saveChangesBtnEl.addEventListener("click", (e) => {
  e.preventDefault();
  const formData = new FormData(editPostFormEl);
  const editedPostData = Object.fromEntries(formData.entries());
  console.log(editedPostData);
  updatePost(editedPostData);
  editPostSectionEl.classList.toggle("enabled");
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

    //TODO:Do the same in the other fetches, and check if the response is ok, if not throw an error with the status code and status text.
    if (resComments.ok || resPosts.ok) {
      console.log("Fetches Post Details and Comments success");
    }

    tempPost = postData;

    renderInitialPageInfo(commentsData, tempPost);
  } catch (e) {
    console.error(e.message);

    renderUserMessages(`Error: ${e.message}`);
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
      userNameTemp: "Anonymous",
      commentContentTemp: formData.newComment,
    });

    renderTempComments();
  } catch (e) {
    console.log(e.message);

    renderUserMessages(`Error: ${e.message}`);
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
      body: JSON.stringify(editedPostData),
    });

    /* if (res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    } */

    const newData = await res.json();
    tempPost = newData;
    renderEditedPost(tempPost);

    console.log(newData);
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
    renderUserMessages("Post deleted successfully");
    console.log(data);
  } catch (e) {
    console.log(e.message);
  } finally {
    console.log("DELETE comment completed");
  }
}

//TODO: create separate functions for post and comments
function renderInitialPageInfo(comment, post) {
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

function renderEditedPost(newPost) {
  postTitleH3El.textContent = newPost.title;
  postDescriptionPEl.textContent = newPost.body;
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

function renderUserMessages(message) {
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
