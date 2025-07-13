Creating a full-stack web application for a blog involves several steps. Below is a simplified guide to building a blog with a React frontend, Node.js backend, and Supabase as the database. I'll provide you with the basic setup, and you can expand upon it as per your requirements.

### Prerequisites

1. **Node.js** and **npm** installed on your machine.
2. **Supabase** account and project setup.
3. Basic understanding of **React**, **Node.js**, and **SQL**.

### Step 1: Set Up Supabase

1. **Create a Supabase Project**: Sign in to Supabase and create a new project.
2. **Database Schema**:
   - You can initiate the Supabase SQL Editor to run the SQL commands to create a database schema.

   ```sql
   CREATE TABLE posts (
       id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       content TEXT NOT NULL,
       author VARCHAR(100),
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. **API Keys**: Get your Supabase API URL and Key from your project settings.

### Step 2: Set Up Node.js Backend

1. **Initialize Your Project**:

   ```sh
   mkdir blog-backend
   cd blog-backend
   npm init -y
   npm install express dotenv cors supabase-js
   ```

2. **Create Server**:

   - Create a file `index.js` in the `blog-backend` folder.

   ```js
   const express = require('express');
   const cors = require('cors');
   require('dotenv').config();
   const { createClient } = require('@supabase/supabase-js');

   const app = express();
   app.use(cors());
   app.use(express.json());

   const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

   app.get('/posts', async (req, res) => {
       const { data, error } = await supabase
           .from('posts')
           .select('*');
       if (error) return res.status(500).json({ error: error.message });
       res.json(data);
   });

   app.post('/posts', async (req, res) => {
       const { title, content, author } = req.body;
       const { data, error } = await supabase
           .from('posts')
           .insert([{ title, content, author }]);
       if (error) return res.status(500).json({ error: error.message });
       res.status(201).json(data);
   });

   const PORT = process.env.PORT || 4000;
   app.listen(PORT, () => {
       console.log(`Server running on port ${PORT}`);
   });
   ```

3. **Environment Variables**:

   Create a `.env` file in the `blog-backend` directory with:

   ```plaintext
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_anon_key
   PORT=4000
   ```

   Replace `your_supabase_url` and `your_anon_key` with your actual Supabase URL and key.

### Step 3: Set Up React Frontend

1. **Create React App**:

   ```sh
   npx create-react-app blog-frontend
   cd blog-frontend
   ```

2. **Install Axios**:

   Inside the `blog-frontend` directory, run:

   ```sh
   npm install axios
   ```

3. **Create Components**:

   - Edit `src/App.js`.

   ```jsx
   import React, { useState, useEffect } from 'react';
   import axios from 'axios';

   function App() {
     const [posts, setPosts] = useState([]);
     const [title, setTitle] = useState('');
     const [content, setContent] = useState('');
     const [author, setAuthor] = useState('');

     useEffect(() => {
       axios.get('http://localhost:4000/posts')
         .then(response => setPosts(response.data))
         .catch(error => console.error(error));
     }, []);

     const createPost = () => {
       axios.post('http://localhost:4000/posts', { title, content, author })
         .then(response => setPosts([...posts, ...response.data]))
         .catch(error => console.error(error));
     };

     return (
       <div className="App">
         <h1>Blog Posts</h1>
         <ul>
           {posts.map(post => (
             <li key={post.id}>
               <h2>{post.title}</h2>
               <p>{post.content}</p>
               <p><i>By {post.author}</i></p>
             </li>
           ))}
         </ul>
         <div>
           <h2>Create a new post</h2>
           <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
           <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)}></textarea>
           <input type="text" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} />
           <button onClick={createPost}>Submit</button>
         </div>
       </div>
     );
   }

   export default App;
   ```

### Step 4: Running the Application

1. **Start the Backend**:

   ```sh
   node index.js
   ```

2. **Start the Frontend**:

   ```sh
   npm start
   ```

Navigate to `http://localhost:3000` in your browser to see your blog application running.

### Final Notes

- This is a basic implementation and doesn't include error handling, authentication, or more advanced features. 
- Consider securing API endpoints and adding user management via Supabase’s auth features.
- For production, make sure to properly configure CORS and secure your environment variables.
- You can deploy the React app and Node.js server to a service like Vercel or Heroku, and the Supabase database is already cloud-hosted.