import request from "."

window.fetch = jest.fn()

it("makes a request with the provided url", async () => {
    window.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ some: "thing" })
    })
    const data = await request.get("hey").send()
    expect(window.fetch).toBeCalledWith("hey", { method: "GET" })
    expect(data).toStrictEqual({ some: "thing" })
})

it("allows header chaining", async () => {
    window.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ some: "thing" })
    })

    const data =
        await request
            .get("hey")
            .header("one", "1")
            .header("two", "2")
            .headers({ three: 3, four: 4 })
            .send()

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
        await request
            .post("hey")
            .withJsonBody({ oh: "no" })
            .send()

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

    const error = await request.get("hey").send().catch(error => error)

    expect(window.fetch).toBeCalledWith("hey", { method: "GET" })
    expect(error).toStrictEqual({ status: 400, statusText: "Nahaan" })
})

describe("supported methods", () => {
    it.each([
        ["get", "GET"],
        ["post", "POST"],
        ["put", "PUT"],
        ["delete", "DELETE"]
    ])("allows sending a %s request", async(methodFunction, expectedMethodHeader) => {
        window.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ some: "thing" })
        })

        await request[methodFunction]("hey").send()

        expect(window.fetch)
            .toBeCalledWith("hey", {
                method: expectedMethodHeader,
            })
    })
})