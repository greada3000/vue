const trimTrailingSlash = (value) => value.replace(/\/$/, '')

const gateway = trimTrailingSlash(import.meta.env.VITE_API_BASE_URL || 'http://localhost')

const serviceBase = (envName, defaultPort) => {
  const configured = import.meta.env[envName]
  return trimTrailingSlash(configured || `${gateway}:${defaultPort}`)
}

const bases = {
  user: serviceBase('VITE_USER_API_URL', 8101),
  relation: serviceBase('VITE_RELATION_API_URL', 8110),
  article: serviceBase('VITE_ARTICLE_API_URL', 8201),
  circle: serviceBase('VITE_CIRCLE_API_URL', 8301),
  review: serviceBase('VITE_REVIEW_API_URL', 8401)
}

const createUrl = (service) => (path = '') => `${bases[service]}${path.startsWith('/') ? path : `/${path}`}`

export const api = Object.freeze({
  user: createUrl('user'),
  relation: createUrl('relation'),
  article: createUrl('article'),
  circle: createUrl('circle'),
  review: createUrl('review')
})
