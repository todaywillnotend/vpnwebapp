module.exports = {
  vpnapi: {
    input: "https://bot.playervpn.ru/api/openapi.json",
    output: {
      mode: "single",
      target: "src/api/generated/api.ts",
      client: "react-query",
      mock: false,
      override: {
        mutator: {
          path: "src/api/client.ts",
          name: "customInstance",
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
  },
};
