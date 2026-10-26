const postTitleH2El = document.querySelector("#postTitle");
const postDescriptionPEl = document.querySelector("#postDescription");

//TODO:Clear the code from here
const titleEl = document.querySelector("#userName");
const descriptionEl = document.querySelector("#userComment");
const btnBackEl = document.querySelector("#backBtn");

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

btnBackEl.addEventListener("click", () => {
  console.log("click");
  window.location.href = "../index.html";
  /*   window.history.back(); */
});

async function getPostDetails() {
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
    renderDetailsInfo(commentsData, postData);
  } catch (e) {
    console.error(e.message);
  } finally {
    console.log("operation fetches details completed");
  }
}

function renderDetailsInfo(comment, post) {
  const { title, body: bodyPost } = post;
  const { user, body } = comment;

  titleEl.textContent = user.fullName;
  descriptionEl.textContent = body;
}

getPostDetails();
