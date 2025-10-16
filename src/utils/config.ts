const firstPath =
  window.location.pathname.split("/")[1] === "app" ? "/app" : "";

export const AppRoutes = {
  getAuthRoute: () => `${firstPath}/login`,
  getBaseRoute: () => firstPath + "/",
};
