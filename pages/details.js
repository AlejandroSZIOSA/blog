const titleEl = document.querySelector("#title");
const descriptionEl = document.querySelector("#bodyText");
const btnBackEl = document.querySelector("#backBtn");

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

btnBackEl.addEventListener("click", () => {
  console.log("click");
  /* window.location.href = "../index.html"; */
  window.history.back();
});

async function getPostDetails() {
  try {
    const res = await fetch(`https://dummyjson.com/comments/${postId}`);
    const data = await res.json();

    console.log(data);
    renderDetailsInfo(data);
  } catch (e) {
    console.error(e.message);
  } finally {
    console.log("operation fetches details completed");
  }
}

function renderDetailsInfo(comment) {
  const { user, body } = comment;

  titleEl.textContent = user.fullName;
  descriptionEl.textContent = body;
}

getPostDetails();
