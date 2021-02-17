/*
 *
 * HomePage
 *
 */

import React, { memo } from "react";
// import PropTypes from 'prop-types';
import pluginId from "../../pluginId";
import downloadFile from "../../utils/downloadFile";
import readFile from "../../utils/readFile";
import { request } from "strapi-helper-plugin";

import { Button, Padded } from "@buffetjs/core";
import { Container, Block, P, Sections } from "../../styles";

const HomePage = () => {
  const [file, setFile] = React.useState(null);

  // takes roles from a .json file and creates/updates roles in the db
  const handleRolesUpdate = async () => {
    try {
      strapi.lockApp();
      await request(`/${pluginId}/roles`, {
        method: "POST",
        body: {
          roles: file,
        },
      });
      strapi.notification.success("Success");
    } catch (err) {
      strapi.notification.error(err.toString());
    }
    strapi.unlockApp();
  };

  // takes roles from the db and downloads into a .json file
  const handleDownload = async () => {
    try {
      const roles = await request(`/${pluginId}/roles`);
      const file = roles.reduce((roles, role) => {
        delete role.users;
        delete role.id;
        delete role.created_by;
        delete role.updated_by;
        roles[role.name] = role;
        return roles;
      }, {});
      downloadFile(file, "strapi-roles");
    } catch (err) {
      strapi.notification.error(err.toString());
    }
  };

  return (
    <Container top bottom left right>
      <h1>Sync Roles And Permissions</h1>
      <P>
        Store user roles and permissions configuration as a JSON file and then
        import and reuse it any time.
      </P>
      <Sections>
        <Block style={{ flex: 1 }}>
          <Padded>
            <h3>Sync Roles And Permissions</h3>
            <P>
              Import and sync your current roles and permissions from a JSON
              file.
            </P>
            <input
              id="upload"
              accept=".json"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  readFile(file, (value, fileName) => {
                    setFile(value);
                  });
                } else {
                  setFile(null);
                }
              }}
              type="file"
            />

            <Button onClick={handleRolesUpdate} disabled={!file}>
              Sync Roles And Permissions
            </Button>
          </Padded>
        </Block>
        <Block style={{ flex: 1 }}>
          <Padded size="lg" id="download">
            <h3>Export Roles And Permissions</h3>
            <P>
              Export your current roles and permissions configuration as a JSON
              file.
            </P>
            <Button onClick={handleDownload}>
              Export Roles And Permissions
            </Button>
          </Padded>
        </Block>
      </Sections>
    </Container>
  );
};

export default memo(HomePage);
