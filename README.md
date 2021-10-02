# fetx, a window.fetch wrapper
This library aims to provide a simple fetch wrapper that helps to simplify its verbosity by replacing it with a set of chainable functions.

# How to use
The usage it's detailed on the test file, but here it goes a couple of example:

### Simple get request
```javascript
request
    .get(<url>)
    .send()
```
### Request with headers
```javascript
request
    .get(<url>)
    .header("Authorization", "Bearer supersecrettoken")
    .headers({
        "CustomHeader": "Something",
        "Cache-Control": "no-cache"
    })
    .send()
```

### Post request with body
```javascript
request
    .post(<url>)
    .withJsonBody(<obj>)
    .send()
    .then(data => console.log("JSON object that was in the response body", data))
    .catch((error) => console.log({ status: 400, statusText: "Bad request" }))
```

# Supported methods
Currently the only methods available are **GET**, **POST**, **PUT** and **DELETE**.
