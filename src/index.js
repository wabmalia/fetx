const request = (url, { initialOptions, extraOperations }) => {
    const options = { ...initialOptions || {} }
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
        send: () => send(url, { ...options }),
    }
    Object.entries(extraOperations || {})
        .forEach(([key, fn]) => operations[key] = fn(options, operations))

    return operations
}

const bodyOperations = {
    withJsonBody: (options, operations) => (obj) => {
        operations.header("Content-Type", "application/json")
        options.body = JSON.stringify(obj)
        return operations
    }
}

const get = (url) => request(url, {
    initialOptions: { method: "GET" }
})

const post = (url) => {
    return request(url, {
        initialOptions: { method: "POST" },
        extraOperations: { ...bodyOperations }
    })
}

const put = (url) => {
    return request(url, {
        initialOptions: { method: "PUT" },
        extraOperations: { ...bodyOperations }
    })
}

const del = (url) => {
    return request(url, {
        initialOptions: { method: "DELETE" },
        extraOperations: { ...bodyOperations }
    })
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

export default {
    get,
    post,
    put,
    delete: del
}