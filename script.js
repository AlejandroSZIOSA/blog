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
    const data = await res.json();
    const { posts } = data;

    posts.forEach((i) => {
      renderBlogItem(i);
    });
  } catch (e) {
    console.error(e.message);
  } finally {
    console.log("operation successful");
  }
}

getBlogsData();

//test from linux
