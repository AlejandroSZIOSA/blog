const messageDivEl = document.querySelector("#message");
const contentDivEl = document.querySelector("#content");
const blogListEl = document.querySelector("#blogList");

const renderBlogItem = function (d) {
  const blogItemEl = document.createElement("li");
  blogItemEl.innerHTML = `<p>${d.title}</p>`;

  blogItemEl.addEventListener("click", () => {
    //navigate to details page using https://dummyjson.com/posts/d.id
    window.location.href = `pages/details.html?id=${d.id}`;
  });

  blogListEl.appendChild(blogItemEl);
};

async function getBlogsData() {
  try {
    const res = await fetch("https://dummyjson.com/posts?limit=10&skip=10");

    if (res.ok) {
      console.log(" Fetch all post succesfull");
    }

    const data = await res.json();
    const { posts } = data;

    posts.forEach((i) => {
      renderBlogItem(i);
    });

    contentDivEl.classList.remove("disabled");
    messageDivEl.classList.remove("enabled");
  } catch (e) {
    contentDivEl.classList.add("disabled");
    messageDivEl.classList.add("enabled");
    messageDivEl.textContent = e.message;
  }
}

getBlogsData();

//test from linux
