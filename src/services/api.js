import axios from "axios";

const trimTrailingSlash = (value) => value.replace(/\/$/, "");
const AUTH_STORAGE_KEY = "communityBasicAuth";

export const setBasicAuth = (userId, password) => {
  const token = btoa(unescape(encodeURIComponent(`${userId}:${password}`)));
  sessionStorage.setItem(AUTH_STORAGE_KEY, token);
  return token;
};

export const clearBasicAuth = () => sessionStorage.removeItem(AUTH_STORAGE_KEY);

export const http = axios.create({
  baseURL: trimTrailingSlash(import.meta.env?.VITE_API_BASE_URL || ""),
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (token) config.headers.Authorization = `Basic ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    error.userMessage =
      data?.message ||
      (status === 401 ? "登录状态已失效，请重新登录" : status === 403 ? "没有权限执行此操作" : "网络请求失败，请稍后重试");
    return Promise.reject(error);
  },
);

export const toPageParams = (input = {}) => {
  const params = typeof input === "string" ? { keyword: input } : input;
  const { keyword, query, page, pageNo, size, pageSize } = params;
  return {
    keyword: keyword ?? query ?? "",
    page: page ?? pageNo ?? 1,
    size: size ?? pageSize ?? 10,
  };
};

const withoutConfirmation = ({ checkPass: _checkPass, confirmPassword: _confirmPassword, ...data }) => data;

export const api = Object.freeze({
  users: {
    get: (id) => http.get(`/api/users/${id}`),
    search: (params) => http.get("/api/users", { params: toPageParams(params) }),
    searchLegacy: (params) => http.post("/api/users/search", toPageParams(params)),
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
    search: (params) => http.get("/api/circles", { params: toPageParams(params) }),
    searchLegacy: (params) => http.post("/api/circles/search", toPageParams(params)),
    create: (circle) => http.post("/api/circles", circle),
    update: (circle) => http.put(`/api/circles/${circle.circleId}`, circle),
    remove: (id) => http.delete(`/api/circles/${id}`),
  },
  articles: {
    get: (id) => http.get(`/api/articles/${id}`),
    search: (params) => http.get("/api/articles", { params: toPageParams(params) }),
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
    statusLegacy: (followerId, followedUserId) =>
      http.post("/api/follows/status", { followerId, followedUserId }),
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
