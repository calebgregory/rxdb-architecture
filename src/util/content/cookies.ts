import { HttpCookie, CloudFrontResource } from '~/src/gql/types/content'

interface Cookie extends HttpCookie {
  domain: string
  path: string
  expires: Date
  secure?: boolean
}

// remove protocol prefix from `resource` URL
// https://abc.com/xyz/pq -> abc.com/xyz/pq
export const removeProtocol = (url: string) => {
  const match = url.match(/^https:\/\/(.*)/)
  if (match) {
    const urlWithoutProtocol = match[1]
    return urlWithoutProtocol
  }
  return ''
}

// abc.def.com/xyz/pq
//   isOriginSiblingDomain ?
//     true  -> .def.com
//     false -> abc.def.com
export const getDomain = (url: string, isOriginSiblingDomain: boolean) => {
  if (url.indexOf('/') < 0) {
    return url
  }

  const domain = url.slice(0, url.indexOf('/'))
  if (isOriginSiblingDomain) {
    const parentDomain = domain.slice(domain.indexOf('.'))
    return parentDomain
  }

  return domain
}

// abc.com/xyz/pq -> /xyz/pq
export const getPath = (url: string) => {
  if (url.indexOf('/') < 0) {
    return '/'
  }

  const path = url.slice(url.indexOf('/'))
  return path
}

export type CookieOptions = {
  secure?: boolean,
  isOriginSiblingDomain?: boolean,
}

const DEFAULT_COOKIE_OPTIONS = {
  /**
    defaults to false, meaning the cookie will be accessible to a page loaded
    over SSL or a page just loaded over HTTP (i.e., in development)
   */
  secure: true,
  /**
    specifies whether the consumer's domain is a sibling of the cloudfront
    distribution's domain. e.g.,
      origin (consumer)       : visionweb.dev.xoeye.com
      cloudfront distribution : content.dev.xoeye.com

    this will not be true if the consumer is vision-web being run locally.
    however, in shared environments (staging, devl, prod) it will be.  this is
    important because in the browser, you cannot set cookies for a different
    domain than your own _unless_ it is a parent domain.

    in local development, it'll look like this:
      origin (consumer)       : vision-web.some-cdn-id.cloudfront.net
      cloudfront distribution : some-cdn-id.cloudfront.net

    in this case, we don't need to chop up a cloudFrontResource.resource's
    domain, because it is a parent domain of origin (consumer; i.e. your
    locally-running vision-web)
   */
  isOriginSiblingDomain: true,
}

export function getCookiesFromCloudfrontResource(cloudFrontResource: CloudFrontResource, cookieOptions: CookieOptions = {}): Cookie[] {
  cookieOptions = {...DEFAULT_COOKIE_OPTIONS, ...cookieOptions}

  const { resource, cookies, expiresAt } = cloudFrontResource

  const url = removeProtocol(resource)
  const domain = getDomain(url, Boolean(cookieOptions.isOriginSiblingDomain))
  const path = getPath(url)
  const expires = new Date(expiresAt)

  const options: any = {
    domain,
    path,
    expires,
  }

  if (cookieOptions.secure) {
    options.secure = true
  }

  const resultCookies = cookies.map((cookie) => ({
    ...options,
    name: cookie.name,
    value: cookie.value,
  }))
  return resultCookies
}
