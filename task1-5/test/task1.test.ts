import axios from "axios";
import { mocked } from "jest-mock";
import type { AxiosResponse } from "axios";
import { fetchPost } from "../src/task1.js";
const { describe, jest, it, expect } = require("@jest/globals");

// To make axios mockable
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Sample Post object
const mockPost = {
  userId: 1,
  id: 1,
  title: "mock title",
  body: "mock body",
};

describe("fetchPost", () => {
  it("should fetch a post successfully", async () => {
    // Arrange
    const response: AxiosResponse = {
      data: mockPost,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any
    };
    mockedAxios.get.mockResolvedValue(response);

    // Act
    const result = await fetchPost(1);

    // Assert
    expect(result).toEqual(mockPost);
  });

  it("should throw error when axios fails", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Network Error"));

    await expect(require("../src/index").fetchPost(1)).rejects.toThrow(
      "Axios error"
    );
  });
});
