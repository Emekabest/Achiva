export default ({ config }) => ({
  ...config,

  plugins: [
    "@react-native-community/datetimepicker",
    "@react-native-google-signin/google-signin",
  ],

  android: {
    ...config.android,
    googleServicesFile: process.env.googleServiceJson,  
},

  extra: {
    ...(config.extra || {}),
    API_URL: process.env.OPENAI_API_KEY,
  },
});

