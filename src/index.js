const request = (url) => {
    const options = {}
    const supportedMethods = [
        "GET", "HEAD", "POST",
        "PUT", "DELETE", "CONNECT",
        "OPTIONS", "TRACE", "PATCH"
    ]

    const operations =  {
        header: (key, value) => {
            if(!options.headers) options.headers = {}
            options.headers[key] = value
            return operations
        },
        headers: (headers) => {
            if(!options.headers) options.headers = {}
            options.headers = { ...options.headers, ...headers }
            return operations
        },
        withJsonBody: (obj) => {
            operations.header("Content-Type", "application/json")
            options.body = JSON.stringify(obj)
            return operations
        },
        ...supportedMethods
            .reduce((acc, method) => ({
                ...acc,
                [method.toLowerCase()]: () => send(url, { ...options, method })
            }), {})
    }
    return operations
}

const send = (url, options) => {
    return window.fetch(url, options)
        .then(response => {
            if(!response.ok){
                throw {
                    status: response.status,
                    statusText: response.statusText
                }
            }
            return response.json()
        })
}

export default request