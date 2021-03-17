export type Config = {
  graphqlEndpoints: { name: string, url: string }[],
  Auth: {
    mandatorySignIn: boolean,
    region: string,
    userPoolId: string,
    identityPoolId: string,
    userPoolWebClientId: string,
  },
  [key: string]: any,
}

const x: Config
export default x