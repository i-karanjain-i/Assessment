// src/index.ts
import axios, { type AxiosResponse } from "axios";

// Define the interface for API response
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// Define a type for API function result
type ApiResponse<T> = Promise<T>;

/**
 * Fetch a post by ID
 * @param id number
 * @returns Promise<Post>
 */
export async function fetchPost(id: number): ApiResponse<Post> {
  try {
    const response: AxiosResponse<Post> = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch post");
  }
}

// Main function
async function main(): Promise<void> {
  try {
    const post = await fetchPost(1);
    console.log("Fetched Post:", post);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
