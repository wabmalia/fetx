import request from "."

window.fetch = jest.fn()

it("makes a request with the provided url", async () => {
    window.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ some: "thing" })
    })
    const data = await request("hey").get()
    expect(window.fetch).toBeCalledWith("hey", { method: "GET" })
    expect(data).toStrictEqual({ some: "thing" })
})

it("allows header chaining", async () => {
    window.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ some: "thing" })
    })
    const data =
        await request("hey")
            .header("one", "1")
            .header("two", "2")
            .headers({ three: 3, four: 4 })
            .get()

    expect(window.fetch)
        .toBeCalledWith("hey", {
            method: "GET",
            headers: { one: "1", two: "2", three: 3, four: 4 }
        })
    expect(data).toStrictEqual({ some: "thing" })
})

it("makes a request with the provided body and marks it as application/json", async() => {
    window.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ some: "thing" })
    })

    const data =
        await request("hey")
            .withJsonBody({ oh: "no" })
            .post()

    expect(window.fetch)
        .toBeCalledWith("hey", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ oh: "no" })
        })
    expect(data).toStrictEqual({ some: "thing" })
})

it("throws an error with the status and status text when the request fails", async () => {
    window.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Nahaan"
    })

    const error = await request("hey").get().catch(error => error)

    expect(window.fetch).toBeCalledWith("hey", { method: "GET" })
    expect(error).toStrictEqual({ status: 400, statusText: "Nahaan" })
})

describe("supported methods", () => {

    it.each([
        ["get", "GET"],
        ["head", "HEAD"],
        ["post", "POST"],
        ["put", "PUT"],
        ["delete", "DELETE"],
        ["connect", "CONNECT"],
        ["options", "OPTIONS"],
        ["trace", "TRACE"],
        ["patch", "PATCH"]
    ])("allows sending a %s request", async(methodFunction, expectedMethodHeader) => {
        window.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ some: "thing" })
        })

        await request("hey")[methodFunction]()

        expect(window.fetch)
            .toBeCalledWith("hey", {
                method: expectedMethodHeader,
            })
    })
})