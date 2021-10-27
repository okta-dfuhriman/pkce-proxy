import React, { Suspense, useState, useEffect } from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { Security, SecureRoute } from "@okta/okta-react";
import { ThemeProvider } from "@mui/material/styles";

import { authConfig, routes } from "./config";
import { AuthProvider } from "./providers";
import { Theme } from "./Style";
import "./Style/App.css";

/**
 * This code defines the react app
 *
 * Imports the router functionality to provide page navigation
 * Defines the Home function outlining the content on each page
 * Content specific to each page (Home and About) is defined in their components in /pages
 * Each page content is presented inside the overall structure defined here
 * The router attaches the page components to their paths
 */

// The component that adds our Meta tags to the page
import { AppNavBar, Seo } from "./components";

const oktaAuth = new OktaAuth(authConfig.oidc);

oktaAuth.start();

const App = () => {
  const history = useHistory();
  const restoreOriginalUri = async (_oktaAuth, originalUri) =>
    history.replace(toRelativeUrl(originalUri || "/", window.location.origin));
  const customAuthHandler = () => {
    history.push("/");
  };

  return (
    <ThemeProvider theme={Theme}>
      <Seo />
      <CssBaseline />
      <Suspense fallback={<div>Loading...</div>}>
        <Security
          oktaAuth={oktaAuth}
          restoreOriginalUri={restoreOriginalUri}
          onAuthRequired={customAuthHandler}
        >
          <AppNavBar />
          <AuthProvider>
            <div>
              <Switch>
                {routes.map(route => {
                  if (route?.isSecure) {
                    return (
                      <SecureRoute
                        key={route.path}
                        path={route.path}
                        exact={route?.exact ?? false}
                        component={route.component}
                      />
                    );
                  } else {
                    return (
                      <Route
                        key={route.path}
                        path={route.path}
                        exact={route?.isExact ?? false}
                        component={route.component}
                      />
                    );
                  }
                })}
              </Switch>
            </div>
          </AuthProvider>
        </Security>
      </Suspense>
    </ThemeProvider>
  );
};
