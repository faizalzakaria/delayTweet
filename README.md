## DelayTweet

Stream tweet with a delay of N. The N can be configured.

## Architecture

![Briefly architecture](https://user-images.githubusercontent.com/3461316/31861108-8751fec4-b759-11e7-8225-55197e905670.png)

## Code Structures

- app: All logics are in here.
- config: All non app code is here, mostly around boot up, env, routes etc.

## Configurations

#### `config/env.js`

- tweedDelay, change this for the delay needed. Defaulted to 24 hours.
```javascript
  default: {
    app: {
      tweetDelay: 24 * 60 // in minute
    },
    ...
  }
```

## Pre-requisites

- Node version 8.7.0 (Only tested with this)
- `yarn install`

## How to run

#### For server

```bash
npm run dev:all
```

or (Run worker seperately)

```
npm run dev
npm run jobs
```

#### For test client

- `node client/test`


<details>
<summary>TODO</summary>

## TODO

- [ ] Add test
- [ ] Production environment
- [ ] Deployment

</details>

