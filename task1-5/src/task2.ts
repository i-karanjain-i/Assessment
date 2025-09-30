import axios, { type  AxiosResponse } from "axios";

// Define API response types
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

// Generic API response type
type ApiResponse<T> = Promise<T>;

/**
 * Fetch a post by ID
 */
async function fetchPost(id: number): ApiResponse<Post> {
  const response: AxiosResponse<Post> = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
  return response.data;
}

/**
 * Fetch a user by ID
 */
async function fetchUser(id: number): ApiResponse<User> {
  const response: AxiosResponse<User> = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  return response.data;
}

/**
 * Fetch post and user in parallel
 */
async function fetchData(): Promise<void> {
  try {
    const [post, user] = await Promise.all([
      fetchPost(1),
      fetchUser(1),
    ]);

    console.log("📌 Post:", post);
    console.log("📌 User:", user);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Run the parallel fetch
fetchData();
