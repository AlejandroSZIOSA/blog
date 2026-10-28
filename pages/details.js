const USER_ID = 5; //Default ID from origin API Documentation

let tempPost = null;
let tempComments = [];

const btnBackEl = document.querySelector("#backBtn");

const messageDivEl = document.querySelector("#messages");
const innerEditPostErrorMsgEl = document.querySelector(
  "#innerEditPostErrorMsg",
);

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
const innerAddCommentErrorMsgEl = document.querySelector(
  "#innerAddCommentErrorMsg",
);

const commentListEl = document.querySelector("#commentList");

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

btnBackEl.addEventListener("click", () => {
  window.location.href = "../index.html";
});

commentFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(commentFormEl);
  const data = Object.fromEntries(formData.entries());
  addComment(data);
});

editBtnEl.addEventListener("click", () => {
  editPostSectionEl.classList.toggle("enabled");
  editPostTitleInputEl.value = tempPost.title;
  editPostContentTextAreaEl.value = tempPost.body;
});

saveChangesBtnEl.addEventListener("click", (e) => {
  e.preventDefault();
  const formData = new FormData(editPostFormEl);
  const editedPostData = Object.fromEntries(formData.entries());
  /* console.log(editedPostData); */
  updatePost(editedPostData);
  /* editPostSectionEl.classList.toggle("enabled"); */
});

deleteBtnEl.addEventListener("click", () => {
  deletePost();
});

const getInitialPostDetails = async function () {
  try {
    const [resComments, resPosts] = await Promise.all([
      fetch(`https://dummyjson.com/comments/${postId}`),
      fetch(`https://dummyjson.com/posts/${postId}`),
    ]);

    const [commentsData, postData] = await Promise.all([
      resComments.json(),
      resPosts.json(),
    ]);

    if (resComments.ok && resPosts.ok) {
      console.log("Fetches Post Details and Comments success");
    }

    tempPost = postData; //Temporal copy of the post before be edited

    renderInitialPageInfo(commentsData, tempPost);
  } catch (e) {
    renderOuterPageUserMsg(`Error: ${e.message}`);
  }
};

async function updatePost(editedPostData) {
  innerEditPostErrorMsgEl.textContent = "";
  try {
    const res = await fetch("https://dummyjson.com/posts/" + postId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedPostData),
    });

    if (res.ok) {
      console.log("Updated Post Success");
      editPostSectionEl.classList.toggle("enabled"); //Hide edit container only if everything is okay
    }

    const newData = await res.json();
    tempPost = newData;
    renderEditedPost(tempPost);
  } catch (e) {
    innerEditPostErrorMsgEl.textContent = e.message;
  }
}

async function deletePost() {
  try {
    const res = await fetch("https://dummyjson.com/posts/" + postId, {
      method: "DELETE",
    });

    if (res.ok) {
      console.log("Deleted Post Success");
    }

    renderOuterPageUserMsg("Deleted Post Success");
  } catch (e) {
    renderOuterPageUserMsg(`Error: ${e.message}`);
  }
}

async function addComment(formData) {
  innerAddCommentErrorMsgEl.textContent = "";

  try {
    const res = await fetch("https://dummyjson.com/comments/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body: formData.newComment,
        postId: postId,
        userId: USER_ID, //ID from origin API
      }),
    });

    if (res.ok) {
      console.log("Comment has been created succesfull");
    }

    addNewTempComment({
      postIdTemp: postId,
      userNameTemp: "Anonymous",
      commentContentTemp: formData.newComment,
    });

    renderTempComments();
  } catch (e) {
    innerAddCommentErrorMsgEl.textContent = e.message;
  }
}

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
  commentTextareaEl.value = "";

  tempComments.push({
    postIdTemp: postIdTemp,
    userNameTemp: userNameTemp,
    commentTemp: commentContentTemp,
  });
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

function renderOuterPageUserMsg(message) {
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

function renderInnerPageUserMsg(msg) {
  innerPageErrorMsgDivEl.innerHTML = `<p>${msg}</p>`;
}

getInitialPostDetails();
