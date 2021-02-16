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
import { Container, Block, P } from "../../styles";

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
      <P>Store your roles and permissions for later.</P>

      <Block>
        <Padded>
          <h3>Update roles</h3>
          <P>Update user roles and permissions from a JSON file.</P>

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
            Update Roles
          </Button>
        </Padded>
      </Block>
      <Block style={{ marginTop: "20px" }}>
        <Padded size="lg" id="download">
          <h3>Download roles</h3>
          <P>
            Get the current user roles and permissions and save them as a JSON
            file.
          </P>
          <Button onClick={handleDownload}>Download Latest Roles</Button>
        </Padded>
      </Block>
    </Container>
  );
};

export default memo(HomePage);
