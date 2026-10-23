const titleEl = document.querySelector("#title");
const bodyEl = document.querySelector("#body");

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

async function getPostDetails() {
  const res = await fetch(`https://dummyjson.com/posts/${postId}`);
  const post = await res.json();

  console.log(post);
}

getPostDetails().catch(console.error);
