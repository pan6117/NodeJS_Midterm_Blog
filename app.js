//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const { default: mongoose } = require("mongoose");

const homeStartingContent = "This is my blog.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const url = "mongodb://localhost:27017/midtermDB";

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to midtermDB.");
  })
  .catch((err) => {
    console.log(err);
  });

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: true,
  },
  categories: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  Post.find({})
    .then((posts) => {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post
    .save()
    .then(() => {
      res.redirect("/home");
    })
    .catch((err) => {
      console.log(err);
    });

  res.redirect("/home");
});

app.get("/posts/:postId", (req, res) => {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }).then((post) => {
    res.render("post", {
      title: post.title,
      content: post.content,
      tags: post.tags,
      categories: post.categories,
    });
  });
});

app.get("/tags/:tagId", (req, res) => {
  //console.log(req.params.tagId);
  const requestedTagId = req.params.tagId;

  Post.findOne({ tags: requestedTagId })
    .then((tags) => {
      res.render("tags", {
        title: tags.title,
        content: tags.content,
        tags: tags.tags,
        categories: tags.categories,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/categories/:categoriesId", (req, res) => {
  //console.log(req.params.categoriesId);
  const requestedCategoriesId = req.params.categoriesId;

  Post.findOne({ categories: requestedCategoriesId })
    .then((categories) => {
      res.render("categories", {
        title: categories.title,
        content: categories.content,
        tags: categories.tags,
        categories: categories.categories,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
