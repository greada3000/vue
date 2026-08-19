import axios from "axios";

const trimTrailingSlash = (value) => value.replace(/\/$/, "");

export const http = axios.create({
  baseURL: trimTrailingSlash(import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"),
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const pageParams = ({ keyword, query, page, pageNo, size, pageSize } = {}) => ({
  keyword: keyword ?? query ?? "",
  page: page ?? pageNo ?? 1,
  size: size ?? pageSize ?? 10,
});

const withoutConfirmation = ({ checkPass: _checkPass, confirmPassword: _confirmPassword, ...data }) => data;

export const api = Object.freeze({
  users: {
    get: (id) => http.get(`/api/users/${id}`),
    search: (params) => http.get("/api/users", { params: pageParams(params) }),
    login: (credentials) => http.post("/api/users/login", credentials),
    create: (user) => http.post("/api/users", withoutConfirmation(user)),
    update: (user) => http.put(`/api/users/${user.userId}`, user),
    changePassword: (id, password) =>
      http.put(`/api/users/${id}/password`, {
        oldPassword: password.oldPassword,
        newPassword: password.newPassword,
      }),
    remove: (id) => http.delete(`/api/users/${id}`),
  },
  circles: {
    get: (id) => http.get(`/api/circles/${id}`),
    byOwner: (id) => http.get(`/api/circles/owner/${id}`),
    search: (params) => http.get("/api/circles", { params: pageParams(params) }),
    create: (circle) => http.post("/api/circles", circle),
    update: (circle) => http.put(`/api/circles/${circle.circleId}`, circle),
    remove: (id) => http.delete(`/api/circles/${id}`),
  },
  articles: {
    get: (id) => http.get(`/api/articles/${id}`),
    search: (params) => http.get("/api/articles", { params: pageParams(params) }),
    byUser: (id) => http.get(`/api/articles/user/${id}`),
    byCircle: (id) => http.get(`/api/articles/circle/${id}`),
    create: (article) =>
      http.post("/api/articles", {
        articleId: article.articleId,
        title: article.title,
        userId: article.userId ?? article.userid,
        username: article.username,
        circleId: article.circleId ?? article.circle,
        content: article.content,
      }),
    update: (article) => http.put(`/api/articles/${article.articleId}`, article),
    remove: (id) => http.delete(`/api/articles/${id}`),
  },
  reviews: {
    get: (id) => http.get(`/api/reviews/${id}`),
    byArticle: (id) => http.get(`/api/reviews/article/${id}`),
    create: (review) =>
      http.post("/api/reviews", {
        reviewId: review.reviewId,
        ownerId: review.ownerId,
        articleId: review.articleId,
        content: review.content,
      }),
    update: (review) => http.put(`/api/reviews/${review.reviewId}`, review),
    remove: (id) => http.delete(`/api/reviews/${id}`),
    removeByArticle: (id) => http.delete(`/api/reviews/article/${id}`),
  },
  follows: {
    followers: (userId) => http.get(`/api/follows/${userId}/followers`),
    following: (userId) => http.get(`/api/follows/${userId}/following`),
    status: (followerId, followedUserId) =>
      http.get("/api/follows/status", {
        params: { followerId, followedUserId },
      }),
    create: (followerId, followedUserId) =>
      http.post("/api/follows", {
        followerId,
        followedUserId,
      }),
    remove: (followerId, followedUserId) =>
      http.delete("/api/follows", {
        params: { followerId, followedUserId },
      }),
  },
});
