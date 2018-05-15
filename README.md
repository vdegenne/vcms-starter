# vcms-starter

## Installation

```bash
github-fetch-starter vcms-starter
```

It'll prompt for configuration values.


## Post-Installation

This framework is using `vcms` framework, check [vcms yarn page](https://yarnpkg.com/en/package/vcms) to have a grasp on how it works.

- [ ] **Run `yarn install`**
- [ ] **Assemble your database sql files in `sql`**.
- [ ] **Create your models in `src/models`**. `Pizza.ts` and `Customer.ts` are not necessary and are just to help remind how objection models work. `User.ts` and `Role.ts` are not necessary too but if your application needs to implement a login support, it's hardly recommended to be based on them.
- [ ] **Create your routers in `src/routers`**. `customer.router.ts` is not necessary and is just here to help remind how to write a router in `vcms` framework. `user.router.ts` is not necessary too but if your application needs to implement a login support, it's hardly recommended to be based on it.
- [ ] **Modify `src/%appname%.ts` to custom your application**.
- [ ] **Use `yarn attach-polymer` to build a Polymer front-end**.
- [ ] **Replace this readme with `README.md.template` with your own content**.
