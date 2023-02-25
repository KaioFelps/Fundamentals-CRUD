export function buildRoutePath(path) {
    // path => /tasks/:id

    const routeParamsRegex = /:([a-zA-Z0-9]+)/g
    const pathWithParams = path.replaceAll(routeParamsRegex, "(?<$1>[a-z0-9A-Z\-_]+)") // <$1> vai nomear o grupo (o q está entre parenteses) com o nome do key
    // /tasks/:id => /tasks/(?<id>[a-z0-9A-Z-_]+)

    const pathRegex = new RegExp(`${pathWithParams}(?<query>\\?(.*))?$`)
    // /tasks/(?<id>[a-z0-9A-Z-_]+) => /\/tasks\/(?<id>[a-z0-9A-Z-_]+)(?<query>\?(.*))?$/
    // in server.js, a Regex.test(pathRegex) is gonna validate the path. Path is no longer a string, but a regex.

    // routes.find(route => route.method === method && route.path === url)
    // routes.find(route => route.method === method && route.path.test(url))
    
    return pathRegex
}