import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import routes from "routes/routes.js";
import { AuthProvider } from "./Context";
import AppRoute from "components/AppRoute";
import Header from "components/TopHeader/Header";
import FooterPage from "./Pages/Footer";

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Header />
          {/* Dynamic Body */}
          <div className="min-h-[50vh]">
            <Switch>
              {routes.map((route) => (
                <AppRoute
                  key={route.path}
                  path={route.path}
                  component={route.component}
                  isPrivate={route.isPrivate}
                />
              ))}
            </Switch>
          </div>
          <FooterPage />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
