"use strict";
const { sanitizeEntity } = require("strapi-utils");

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
    const service =
      strapi.plugins["users-permissions"].services.userspermissions;

    if (user.roles[0].id != 1) {
      return ctx.unauthorized("You must be admin to access this resource!");
    }

    const [roles, plugins] = await Promise.all([
      service.getRoles(),
      service.getPlugins(),
    ]);

    const rolesWithPermissions = await Promise.all(
      roles.map(async (role) => await service.getRole(role.id, plugins))
    );

    return rolesWithPermissions.map((role) =>
      sanitizeEntity(role, {
        model: strapi.plugins["users-permissions"].models.role,
      })
    );
  },

  updateRoles: async (ctx) => {
    const { roles } = ctx.request.body;
    const { user } = ctx.state;

    const service =
      strapi.plugins["users-permissions"].services.userspermissions;

    if (user.roles[0].id != 1) {
      return ctx.unauthorized("You must be admin to access this resource!");
    }

    const roleNames = Object.keys(roles);

    for (let i = 0; i < roleNames.length; i++) {
      const data = roles[roleNames[i]];
      const role = await strapi
        .query("role", "users-permissions")
        .findOne({ name: data.name });
      const users = role ? role.users : [];
      data.users = users;
      if (!role) {
        await service.createRole(data);
      } else {
        await service.updateRole(role.id, data);
      }
    }

    return { success: true };
  },
};
