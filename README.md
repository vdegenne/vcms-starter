# vcms-starter

## Installation

```bash
github-fetch-starter vcms-starter
```

It'll prompt for configuration values.


## Post Installation

- This framework is using `vcms` node dependency, [check yarn page](https://yarnpkg.com/en/package/vcms) to have a grasp on how it works.
- `Pizza.ts` and `User.ts` in `src/models` are not necessary and are just here to help remind how objection models should be written. `User.ts` and `Role.ts` are not necessary too but if your application has a login scheme you should consider getting inspired by them.
- Same for `customer.router.ts` in `src/routers`, it's use for reference purpose only and can be deleted without fear of breaking the application.
- Replace this readme with `README.md.template` with your own content.
