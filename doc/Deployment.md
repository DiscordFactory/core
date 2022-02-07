# Deployment
Deployment is the logical phase after developing an application. This section will deal with the production deployment of the application. In the first time, you should to install all dependencies.

## Starting your project
All you have to do is install the dependencies with the following commands

```bash
npm install
# or
yarn install
```

In the second time, you should build your application because the production mode cannot read and execute the typescript natively.

```bash
npm run build
# or
yarn build
```

## Deploy with PM2
PM2 is a daemon process manager that will help you manage and keep your application online 24/7.

### Install PM2 :
```bash
npm install -g pm2
# or
yarn global add pm2
```

Create a root file named `ecosystem.config.js`.

###### ecosystem.config.js
```ts
module.exports = {
  apps : [{
    name : 'Discord Factory application',
    script : 'npm',
    args : 'start'
  }]
}
```

::: info
You can generate the `ecosystem.config.js` file using the following command:
```bash
yarn factory pm2:ecosystem
# or
npm run factory pm2:ecosystem
```
:::

Then open a terminal in the root folder of your application and run the following command :
```bash
cd /path/to/project/folder/root
pm2 start
```

## Deploy with Docker
Docker is free software for launching applications in isolated containers.

Learn more in the [Docker Documentation]()

::: warning
In the docker section, replace
- [name] with the name of your bot,
- [version] with the version of your bot. (You can use `latest`, `dev`... with docker)
- [env] with your env file (`environment.json` or `environment.yml`)
:::

Create a root file named Dockerfile.

```dockerfile
FROM node:16-alpine3.11

RUN mkdir -p /usr/src/[name]

WORKDIR /usr/src/[name]

COPY . /usr/src/[name]

RUN yarn build

CMD ["yarn", "start"]
```

Then open a terminal in the root folder of your application and run the following command :

```bash
cd /path/to/project/folder/root
docker build -t [name]:[version] .
```

Use docker-compose to automate the start command of your bot with the following content :
```dockerfile
version: "3"

services:
  [name]:
    image: [name]:[version]
    container_name: [name]
    volumes:
      - "/path/to/project/folder/root/[env]:/usr/src/[name]/[env]:ro"
```

Finally, you can run your image inside a container with the following command :

```bash
docker-compose up -d
```

::: info
The option -d allows to launch the container in the background.
:::

To stop the container, run the following command :
```bash
docker-compose down
```

To stop see the log of your discord bot, run the following command :

```bash
docker logs [name]
```