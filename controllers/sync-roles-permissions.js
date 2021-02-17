"use strict";
const { sanitizeEntity } = require("strapi-utils");
const yup = require("yup");

const roleSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  type: yup.string().required(),
  permissions: yup.object({
    application: yup.object({}),
    "content-manager": yup.object({}),
    "content-type-builder": yup.object({}),
    "users-permissions": yup.object({}),
  }),
});

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

    const roleValues = Object.values(roles);

    const isValidJSON = await Promise.all(
      roleValues.map(async (role) => {
        return roleSchema.isValid(role);
      })
    ).then((values) => values.every(Boolean));

    if (!isValidJSON) {
      return ctx.throw(400, "Please provide a valid JSON");
    }

    await Promise.all(
      roleValues.map(async (data) => {
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
      })
    );

    return { success: true };
  },
};
