# vcms-starter

## Installation

```bash
github-fetch-starter vcms-starter
```

It'll prompt for configuration values.


## Guide

This framework is using `vcms` framework, check [vcms yarn page](https://yarnpkg.com/en/package/vcms) to have a grasp on how it works.


- [ ] **Run `yarn vcms:install`**. This will install the dependencies and init the environment. `yarn install` is not required.
- [ ] **Assemble your database sql files in `sql`**.
- [ ] **Create your models in `src/models`**. `Pizza.ts` and `Customer.ts` are not necessary and are just to help remind how objection models work. `User.ts` and `Role.ts` are not necessary too but if your application needs to implement a login support, it's hardly recommended to be based on them.
- [ ] **Create your routers in `src/routers`**. `customer.router.ts` is not necessary and is just here to help remind how to write a router in `vcms` framework. `user.router.ts` is not necessary too but if your application needs to implement a login support, it's hardly recommended to be based on it.
- [ ] **Modify `startupconfig.ts`** to customize your application.
- [ ] **Tests in `./src/test/`.**
- [ ] **`yarn backend:start` or `yarn backend:watch`** to start the server (backend).
- [ ] **Replace this readme** with `README.md.template` with your own content.

*No need to run `yarn vcms:build` on development side because this is long process, it will build the typescripts and the polymer application if there is one. `yarn backend:start` will compile the code before running. We use `yarn backend:watch` if we need to compile everytime we change the typescripts.*


### For Polymer front-end development
- [ ] **Use `yarn polymer:attach`** to init a Polymer front-end application.
- [ ] **run `yarn polymer:start` and `yarn polymer:stop`** to run and stop the development server.


### deploying

When the application is uploaded to the remote server :
- [ ] `yarn vcms:install`
- [ ] `yarn vcms:build`
- [ ] `yarn test` to make sure the build is working.
- [ ] `yarn run` or use `pm2`.
