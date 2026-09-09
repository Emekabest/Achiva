export default ({ config }) => ({
  ...config,

  plugins: ["@react-native-community/datetimepicker"],

  extra: {
    ...(config.extra || {}),
    API_URL: process.env.OPENAI_API_KEY,
    eas: {
      projectId: "2f1bf3e0-30be-4e27-84bd-83ff1e65c61f",
    },
  },
});