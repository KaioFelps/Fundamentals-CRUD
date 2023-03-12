import http from "node:http"
import getReqBody from "./utils/get-req-body.js"
import { getQueryParams } from "./utils/get-query-params.js"
import { routes } from "./routes.js"

const server = http.createServer(async (req, res) => {
    const { url, method } = req
    const activeRoute = routes.find(route => route.method === method && route.path.test(url))

    await getReqBody(req)
    
    if (activeRoute === undefined) {
        return res.writeHead(404).end()
    }

    const activeRouteParams = req.url.match(activeRoute.path)
    const { query, ...params } = activeRouteParams.groups
    // query = "?foo=bar&foo=bar"

    req.query = query ? getQueryParams(query) : {}
    req.params = params ? params : {}

    activeRoute.handler(req, res)
})

server.listen(80)