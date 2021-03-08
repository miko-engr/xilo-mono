import * as jsforce from 'jsforce';
//Just init the connection so we can get token and url etc.
declare global {
  let conn: any;
}
export const init = async function () {
  conn = new jsforce.Connection({
    // you can change loginUrl to connect to sandbox or prerelease env.
    loginUrl: process.env.SF_LOGIN_URI,
    clientId: process.env.SF_CLIENT_ID,
    clientSecret: process.env.SF_CLIENT_SECRET,
    redirectUri: process.env.SF_REDIRECT_URI,
  });

  conn.login(process.env.SF_USERNAME, process.env.SF_PASSWORD, function (
    err,
    userInfo
  ) {
    if (err) {
      return console.log(err);
    }
    // Now you can get the access token and instance URL information.
    // Save them to establish connection next time.
    console.log('access token : ' + conn.accessToken);
    console.log('instanceUrl : ' + conn.instanceUrl);
    // logged in user property
    // console.log("User ID : " + userInfo.id);
    // console.log("Org ID : " + userInfo.organizationId);
    // console.log("------------------------")
    // console.log("Now you can connect --> ");
    //refreshToken();
    return userInfo;
  });
};
