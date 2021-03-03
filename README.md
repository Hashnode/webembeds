# Webembeds 

**(⚠️ Not to be used in production yet)**

Built and supported by [Hashnode](https://hashnode.com)

- Checkout demo here https://webembeds.com/demo

This project is in its very infant stage. There is high scope of improvement here and we have some plans for improvements and stability. We would appreciate any kind of contribution to this project.

## Development
- Run `yarn` within the repo
- Run `core:watch` to start the website in development mode
- Run `website:dev` to start the website in development mode (Make sure to rerun when you change @webembeds/core files)

## Host it anywhere  
- Clone the repo  
- Run `yarn` within the repo
- `yarn build-all && yarn website:start`
- Visit http://localhost:3000

## Contributing
- We will be working mainly on `development` branch and the `master` branch remains untouched.
- Create feature branches checked out from `development` branch and raise PR against `development` once done.
- Continuous deployment is setup for `development` branch to be deployed to https://staging.webembeds.com and the master branch to https://webembeds.com

Clone the repo and run  

`yarn` and checkout package.json for all available scripts.  

## Bugs, Future plans and Improvements

Please visit [issue section](https://github.com/Hashnode/webembeds/issues) of this repo.

### Commit style
We follow conventional commits specs (https://www.conventionalcommits.org/en/v1.0.0/).   
Once done you can run `git cz` or `yarn commit` to commit your changes.
