# vcms-starter

## Installation

```bash
github-fetch-starter vcms-starter
```

It'll prompt for configuration values.


## Guide

This framework is using `vcms` framework, check [vcms yarn page](https://yarnpkg.com/en/package/vcms) to have a grasp on how it works.


- [ ] **Run `yarn install:env`**. This will install the dependencies and init the environment. `yarn install` is not required.
- [ ] **Assemble your database sql files in `sql`**.
- [ ] **Create your models in `src/models`**. `Pizza.ts` and `Customer.ts` are not necessary and are just to help remind how objection models work. `User.ts` and `Role.ts` are not necessary too but if your application needs to implement a login support, it's hardly recommended to be based on them.
- [ ] **Create your routers in `src/routers`**. `customer.router.ts` is not necessary and is just here to help remind how to write a router in `vcms` framework. `user.router.ts` is not necessary too but if your application needs to implement a login support, it's hardly recommended to be based on it.
- [ ] **Open `src/%appname%.ts`** and custom your application.
- [ ] **`yarn backend:start` or `yarn backend:watch`** to start the server (backend).
- [ ] **Replace this readme** with `README.md.template` with your own content.

### For Polymer front-end development
- [ ] **Use `yarn polymer:attach`** to init a Polymer front-end application.
- [ ] **run `yarn polymer:start` and `yarn polymer:stop`** to run and stop the development server.
