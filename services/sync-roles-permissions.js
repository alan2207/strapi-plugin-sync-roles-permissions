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
 * sync-roles-permissions.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

module.exports = {
  getRoles: async () => {
    const service =
      strapi.plugins["users-permissions"].services.userspermissions;

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

  updateRoles: async (roles, ctx) => {
    const service =
      strapi.plugins["users-permissions"].services.userspermissions;

    const roleValues = Object.values(roles);

    const isValidJSON = await Promise.all(
      roleValues.map(async (role) => {
        return roleSchema.isValid(role);
      })
    ).then((values) => values.every(Boolean));

    if (!isValidJSON) {
      const errorMessage = "Please provide a valid JSON";
      if (ctx) {
        return ctx.throw(400, errorMessage);
      }

      throw new Error(errorMessage);
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

    return true;
  },
};
