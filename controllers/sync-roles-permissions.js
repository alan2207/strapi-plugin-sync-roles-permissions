"use strict";

/**
 * sync-roles-permissions.js controller
 *
 * @description: A set of functions called "actions" of the `sync-roles-permissions` plugin.
 */

module.exports = {
  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async (ctx) => {
    // Add your own logic here.

    // Send 200 `ok`
    ctx.send({
      message: "ok",
    });
  },

  getRoles: async (ctx) => {
    const { user } = ctx.state;

    if (user.roles[0].name !== "Super Admin") {
      return ctx.unauthorized("You must be admin to access this resource!");
    }

    return strapi.plugins["sync-roles-permissions"].services[
      "sync-roles-permissions"
    ].getRoles();
  },

  updateRoles: async (ctx) => {
    const { user } = ctx.state;
    const { roles } = ctx.request.body;

    if (user.roles[0].name !== "Super Admin") {
      return ctx.unauthorized("You must be admin to access this resource!");
    }

    await strapi.plugins["sync-roles-permissions"].services[
      "sync-roles-permissions"
    ].updateRoles(roles, ctx);

    return { success: true };
  },
};
