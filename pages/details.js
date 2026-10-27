const USER_ID = 1; // just for testing, use a unique userId
let tempComments = [];

const btnBackEl = document.querySelector("#backBtn");

const errorMsgDivEl = document.querySelector("#errorMsg");
const contentDivEl = document.querySelector("#content");

const postTitleH3El = document.querySelector("#postTitle");
const postDescriptionPEl = document.querySelector("#postDescription");

const commentFormEl = document.querySelector("#commentForm");
const commentTextareaEl = document.querySelector("#newComment");

const commentListEl = document.querySelector("#commentList");

const userNameH3El = document.querySelector("#userName");
const userComentPEl = document.querySelector("#userComment");

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

btnBackEl.addEventListener("click", () => {
  console.log("click");
  window.location.href = "../index.html";
  /*   window.history.back(); */
});

commentFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(commentFormEl);
  const data = Object.fromEntries(formData.entries());
  addComment(data);
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

    errorMsgDivEl.textContent = `Error: ${e.message}`;
    errorMsgDivEl.classList.remove("disabled");
    contentDivEl.classList.add("disabled");
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
  } catch (e) {
    console.log(e.message);

    errorMsgDivEl.textContent = `Error: ${e.message}`;
    errorMsgDivEl.classList.remove("disabled");
    contentDivEl.classList.add("disabled");
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
  const { title, body: postDescription, id } = post;
  const { user, body: commentContent } = comment;

  postTitleH3El.textContent = title;
  postDescriptionPEl.textContent = postDescription;

  let userFullname = user.fullName;

  userNameH3El.textContent = userFullname;
  userComentPEl.textContent = commentContent;

  const newCommentData = {
    postId: id,
    userFullname: userFullname,
    commentContent: commentContent,
  };
  addNewTempComment(newCommentData);
}

function addNewTempComment({ postId, userFullname, commentContent }) {
  tempComments.push({
    postIdTemp: postId,
    userNameTemp: userFullname,
    commentTemp: commentContent,
  });
  console.log(tempComments);
}

function renderTempComments() {
  tempComments.forEach((comment) => {
    const { postIdTemp, userFullnameTemp, commentContentTemp } = comment;
  });
}

getPostDetails();
