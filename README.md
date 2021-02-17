# strapi-plugin-sync-roles-permissions

[![NPM](https://img.shields.io/npm/v/strapi-plugin-sync-roles-permissions.svg)](https://www.npmjs.com/package/strapi-plugin-sync-roles-permissions)

Store user roles and permissions configuration as a JSON file and then import and reuse it any time.

![Admin](screenshot.png)

## Motivation

Sometimes our applications require lots of different types of users with a lot of different permissions. Strapi with it's `strapi-plugin-users-permissions` gives us a lot of functionalities out of the box, which is great. However, it would be nice to be able to store the roles and permissions configuration in order to be able to share it across multiple instances of the application. It is especially useful during development so we don't have to configure it every time we clear the db.

With this plugin we can export existing roles and permissions configuration as a JSON file at any point of time, and then whenever we need to update the application with the given configuration we can just upload the same JSON file and roles and permissions will be synced in the db.

## Installation

#### 1.

This plugin is built on top of the official `strapi-plugin-users-permissions` plugin, so make sure it is already enabled.

#### 2.

Install with npm:

```
npm install --save strapi-plugin-sync-roles-permissions
npm run build
```

Install with yarn:

```
yarn add strapi-plugin-sync-roles-permissions
yarn build
```

#### 4.

Start your strapi server.

## Usage

1. If you have a new application, configure all your roles and permissions from roles section in settings of the admin panel.

2. Then you can export your roles and permissions into a JSON file and store it somewhere.

3. Then any time you want to populate your db with the exported roles and permissions configuration, you can do that by importing the JSON file and update roles and permissions.

4. The same proccess can be repeated any time you want to save your current roles and permissions configuration. Your roles configuration in the db will be overriden with the one from the JSON file.

## LICENSE

MIT
