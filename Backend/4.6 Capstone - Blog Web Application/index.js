import express from 'express';

const app = express();
const port = 3000;

app.use(express.static('./public'));
app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const postsArr = [
  {
    id: 1,
    emailPost: 'jim@email.com',
    username: 'Jim Fill',
    titlePost: 'First Post',
    textPost: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
              when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
              It has survived not only five centuries, but also the leap into electronic typesetting, 
              remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset 
              sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like 
              Aldus PageMaker including versions of Lorem Ipsum.`,
    datePost: new Date().toDateString('dd/MM/yyyy'),
  },
  {
    id: 2,
    emailPost: 'ema@email.com',
    username: 'Emma Jill',
    titlePost: 'That one post',
    textPost: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
              when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
              It has survived not only five centuries, but also the leap into electronic typesetting, 
              remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset 
              sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like 
              Aldus PageMaker including versions of Lorem Ipsum.`,
    datePost: new Date().toDateString('dd/MM/yyyy'),
  },
];

const getPostWithId = (id) => {
  return postsArr.findIndex((p) => parseInt(p.id) === id);
};

// Get all Posts
app.get('/', (req, res) => {
  res.render('./index.ejs', { posts: postsArr });
});

// Get one Post:
app.get('/read_post/:id', (req, res) => {
  const id = parseInt(req.params.id.substring(2, req.params.id.length - 1));
  const postToEdit = postsArr.find((p) => parseInt(p.id) === id);

  res.render('./read_post.ejs', {
    post: postToEdit,
  });
});

// Post:
app.get('/new_post', (req, res) => {
  // here we just send a empty object, because the create and edit share the same form:
  res.render('./new_post.ejs', { post: {} });
});

// Post:
app.post('/new_post', (req, res) => {
  const id = postsArr[postsArr.length - 1].id + 1;
  const { emailPost, username, titlePost, textPost } = req.body;
  // console.log('emailPost: ' + emailPost);

  postsArr.push({
    id: id,
    emailPost: emailPost,
    username: username,
    titlePost: titlePost,
    textPost: textPost,
    datePost: new Date().toDateString('dd/MM/yyyy'),
  });

  // console.log(postsArr);
  res.render('./index.ejs', { posts: postsArr });
});

// PUT Post
app.get('/edit/:id', (req, res) => {
  const id = parseInt(req.params.id.substring(2, req.params.id.length - 1));
  const postToEdit = postsArr.find((p) => parseInt(p.id) === id);

  res.render('./edit_post.ejs', {
    post: postToEdit,
  });
});

// PUT Post
app.post('/edit/:id', async (req, res) => {
  const { emailPost, username, titlePost, textPost } = await req.body;

  const id = parseInt(req.params.id.substring(2, req.params.id.length - 1));

  const postToEdit = getPostWithId(id);
  // console.log(postsArr[postToEdit]);

  postsArr[postToEdit] = {
    id: id,
    emailPost: emailPost,
    username: username,
    titlePost: titlePost,
    textPost: textPost,
    datePost: new Date().toDateString('dd/MM/yyyy'),
  };

  res.render('./index.ejs', { posts: postsArr });
});

// Delete:
app.post('/delete/:id', async (req, res) => {
  const id = parseInt(req.params.id.substring(2, req.params.id.length - 1));

  const postToDelete = getPostWithId(id);
  // console.log(postsArr[postToDelete]);

  postsArr.splice(postToDelete, 1);

  res.render('./index.ejs', { posts: postsArr });
});

app.get('/about', (req, res) => {
  res.render('./about.ejs');
});

app.get('/contact', (req, res) => {
  res.render('./contact.ejs');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
