## Instructions to run
* rename the file .env.example to .env
* fill the enviroment variables in .env file
    * NODE_ENV=dev/prod
    * MONGODB_CONNECT_URL and REDIS_URL
    * SEED_DB=true/false // set to true to seed the db with some data
* run npm i
* commands to build and run
    * > npm run build
    * > npm run start
* command to run dev 
    * > npm run dev
* command to run tests
    * > npm run test


## APIs
NOTE: All apis except `/login` are authenticated. So send Authorization header in request.
 `Authorization: Bearer {token}`
1. POST /api/v1/auth/login
    - request body
        - `{"username": "test", password: "test"}`

2. POST /api/v1/user/add-item
    - request body
        - `{"itemId": "id of movie or tv show", itemType: "movie" / "tvShow"}`

3. POST /api/v1/user/remove-item
    - request body
        - `{"id": "list item unique id"}`
        
4. GET /api/v1/user/list?page={page}&pageSize={pageSize}
    - request query params
        - page: number | optional | default: 1
        - pageSize: number | optional | default: 10

## Optimisations
* As per the requirements, the list api should have low latency. So I have cached the responses.

## Assumptions
* Assuming no movie or tvshow are added in the list until the user's list cache expires otherwise it will not show the updated list until cache expiry.

## Better cache optimization
* Instead of caching the hydrated response of each page, we can store the id of movie/tvshow in a redis list, where key-value pair will look like: `user_id:[item_id1, item_id2, ...]`
* For `\add-item` or `\remove-item` apis, we can add/remove an id from the list.
* For `\list` api we can pick the subarray depending on the page and pageSize parameters. Then we can hydrate the item_ids and return the response. Since hydrating a list of movies/tvshow can be slow, so we need to cache their details too. We can simply do redis multicall to get the hydrated details of a list of movie/tvshow.
