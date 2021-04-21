"use strict";

const getRandomLikes = () => {
  return Math.ceil(Math.random() * 2069);
};

class Post {
  constructor(title, body, userId, id, renderColIndex) {
    this.title = title;
    this.body = body;
    this.userId = userId;
    this.id = id;
    this.renderPost(renderColIndex);
  }
  renderPost(renderColIndex) {
    const postItem = document.createElement("div");
    postItem.classList.add("post-item");
    postItem.id = `post-item-${this.id}`;
    let content = `
        <div class='post-item-text-box'>
        <h3 class='post-item-title'>${this.title}</h3>
        <p class='post-item-body'>${this.body}</p>
        </div>
        <div class='post-item-details-box'>
        <div class='post-item-comments' data-target='${this.id}'></div>
        <h6 class='post-item-likes'>${getRandomLikes()} LIKES</h6>
         <h6 class='post-item-reply'>REPLY</h6>
        </div>
          `;

    postItem.innerHTML = content;

    document
      .querySelectorAll(".post-list-col")
      [renderColIndex].appendChild(postItem);
  }
}

class Posts {
  constructor() {
    this.getInfoForPosts().then(() => {
      const comments = new Comments();
    });
  }

  getPostsFromApi() {
    return new Promise((resolve) => {
      fetch("https://jsonplaceholder.typicode.com/posts").then((response) =>
        response.json().then((value) => resolve(value))
      );
    });
  }
  async getInfoForPosts() {
    let posts = await this.getPostsFromApi();

    posts.forEach((p, index) => {
      new Post(p.title, p.body, p.userId, p.id, index % 3);
    });
  }
}

class Comment {
  constructor(postId, name, email, body) {
    this.postId = postId;
    this.name = name;
    this.email = email;
    this.body = body;
    this.renderComment();
  }
  renderComment() {
    const commentItem = document.createElement("div");
    commentItem.classList.add("comment-item");

    let content = `
         
          <h3 class="comment-item-user">${this.name} ${this.email}</h3>
          <p class="comment-item-body">${this.body}</p>
    
        `;
    commentItem.innerHTML = content;
    document.querySelectorAll(".post-item-comments").forEach((post) => {
      post.addEventListener("click", (btn) => {
        if (btn.target.attributes[1].value == this.postId) {
          document
            .getElementById(`post-item-${btn.target.attributes[1].value}`)
            .appendChild(commentItem);

          commentItem.classList.toggle("comment-item--active");
        }
      });
    });
  }
}
class Comments {
  constructor() {
    this.getInfoForComments();
  }
  getCommentsFromApi() {
    return new Promise((resolve) => {
      fetch("https://jsonplaceholder.typicode.com/comments").then((response) =>
        response.json().then((value) => resolve(value))
      );
    });
  }
  async getInfoForComments() {
    let comments = await this.getCommentsFromApi();

    comments.forEach((c) => {
      new Comment(c.postId, c.name, c.email, c.body);
    });
  }
}

const posts = new Posts();
