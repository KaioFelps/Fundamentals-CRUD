export default async function getReqBody(req) {
    try {
        const buffers = []

        for await (const chunk of req) {
            buffers.push(chunk)
        }
        
        const newBufferedResponse = Buffer.concat(buffers)
        const bufferedResponseHumanReadable = newBufferedResponse.toString()

        if (bufferedResponseHumanReadable[0] !== "{" || bufferedResponseHumanReadable[0] !== "[") return req.body = bufferedResponseHumanReadable

        req.body = JSON.parse(bufferedResponseHumanReadable)
    }

    catch {
        console.log("caiu no catch")
        req.body = null
    }
}