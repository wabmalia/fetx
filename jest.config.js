module.exports = {
    clearMocks: true,
    setupFilesAfterEnv: [
        "regenerator-runtime/runtime"
    ],
    testEnvironment: "jsdom"
}