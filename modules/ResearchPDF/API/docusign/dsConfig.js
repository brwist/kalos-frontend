
/**
 * @file
 * The configuration file for the example.
 * @author DocuSign
 */

const env = process.env;

const CLIENT_ID = 'c97ec80b-04e9-4750-867a-161286ec5786';
const IMPERSONATED_GUID = '52c68e9c-adf1-4dcd-ba42-37b1083f7d59';
const USER_EMAIL = 'pavel.chernov@toptal.com';
const CC_EMAIL = 'pavel.chernov@toptal.com';
const USER_FULLNAME = 'Pavel Chernov';
const CC_FULLNAME = 'Pavel Chernov';
const RSA_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA6EeWBumYkQxMnAfrvm5NEvggekPwFF9t3kdWHARqjBhHRkBs
8ZsCi70WnUP6ZwdT1vPdeev6zi7k11CPyvma/gFXhhVZz3rW3MuiO2yDlZ5Sf4YG
f97MIOofanNEn3a8chi4z2fhKAMLi02gu88qrEiFQabHIqZ9ZFrF7z5DOy7OLn5J
op/wP4fqB81Q+lKArOfYNT88Xcs4lOrSqcO9feJ9EaZQOAZJ/iE5BTkXYhLgSibQ
M15dIdiYtW0MhdrkR9KEwMphEpL8oXavS49B0H6Bjt6Zb2jbWszVw7P++Vqh6lMg
ye6FAGfBWcOpXxpdoEGrs45NjinqEg5X5q/AUwIDAQABAoIBAApr/9bCj2Zeq2dK
0bCDKXEi8e4ac0CuwXK6N6pdJlyv0C7eQCUdA+G6M7QNs0QBJ6la2sKYLHIo13qz
sif0yBgCfmdVOOjexZo1hstsxICnkGMJY+xD1lvZtVwk3NzcynrCEjS4H/mYHWH8
MyyKEIuXW2dFMOUknDau/feMjx6uFoxOrm2TDRcWt2BUIIgK4weL5ALlQ6Qi/n3S
zAjLPsxL1Ziyzd0Vtoy/J793fNU9OxD3d6b8xh9PtiDBvKTXsL8KMhjplCFRW5AE
Oq++w87b8g5HS9dCmPNHexXnY7nCvsPlctXBW+BC6dARChSkuSJl9/XruZmbTyDF
wOm9Fz0CgYEA++c2a6hqQhtta1G6QfKIDTtLNx9ZExQoQYqr886VO7GeqUICvyuY
3oItSt8iMHXSodaO1dW8jDO2RHtwJyNlTGIo/xwwhETAKrlORsy5xTuLsZ0lP/4t
HJEiHSmD4N3Mvd0dbi8mElZ4YvHmnAMFqDwR3kdSD/4cvx1j4sgkyycCgYEA7A6r
9zPYYY8/aVWGS3qWKkaRTnDPLJrDxoUbDsZZl/6eHjN2PxdYxmDb/T46ZX0Gttaf
G0dDm44T7QUGC8Vq4JJ7PNn0GLXW7BRQviosG1MyMwrlsjHyNGqlmKlLh73serJY
EPW+bLCR50QNGLSB5rNFlGh5vx9nV2+xJRygjPUCgYAF3JJ6nNekJCk+pw8ze6ZI
0Ilmhfc3p29sXwKzUKpOUkrD24Je2m/bNaJCLMEJ6aP2Gh0Gwst5Y7apD0pDzuIL
jfkwPoKugT8Lf3Zf1WG5QjJ09pgoTgzUrlfh39ZuxBqAjIWjy7sSECsK+mAIX1Wh
XYx45KX3M02N8OwjGc8pXwKBgQCrRSHkJAu1DTgW9uSPUwws9DJtVVAbrtao7N5q
4+MRcr3Kb9A1inzwwkoa/dFk3UfH1QRvyE73SCiQ6fovBDe9ZMphpkmCvDyJ4VuL
/hEuajib7CYoGjD/cvlfQEX64QP5KfjXpVVaiunxf+B4sk8l0aCEQyFCWEikmfdP
U+vxGQKBgQCujuybzcU+vT/7qK/pcaOwVxuPtG1npGB9yno43ur49Xl6H0R6ydOW
WfCsBopBXkDMRlLciMTfHZdTIRzjchRiBvsuvP3u21kt7nAE/mVPCzM8c0acWESi
MI0EglV6xxLWgBoCud3d36lh+ofsyxnFB/f6rtBc7+ZjOLkfHoikjQ==
-----END RSA PRIVATE KEY-----`;

exports.config = {
    /** The app's integration key. "Integration key" is a synonym for "client id.' */
    clientId: env.DS_CLIENT_ID || CLIENT_ID
    /** The guid for the user who will be impersonated.
     *  An email address can't be used.
     *  This is the user (or 'service account')
     *  that the JWT will represent. */
  , impersonatedUserGuid: env.DS_IMPERSONATED_USER_GUID || IMPERSONATED_GUID
    /** The email address for the envelope's signer. */
  , signerEmail: env.DS_SIGNER_EMAIL || USER_EMAIL
    /** The name of the envelope's signer. */
  , signerName: env.DS_SIGNER_NAME || USER_FULLNAME
    /** The email address for the envelope's cc recipient.
      * It can't be the same as the signer's email unless
      * the account is set to enable someone to be repeated in
      * the recipient list. */
  , ccEmail: env.DS_CC_EMAIL || CC_EMAIL
    /** The name of the envelope's cc recipient. */
  , ccName: env.DS_CC_NAME || CC_FULLNAME
    /** The private key */
    /** Enter the key as a multiline string value. No leading spaces! */
  , privateKey: env.DS_PRIVATE_KEY || RSA_PRIVATE_KEY
    /** For the Developer Sandbox (demo) use <b>https://account-d.docusign.com</b><br>
      * For production (all sites) use <b>https://account.docusign.com</b> */


  /** The account_id that will be used.
   *  If set to false, then the user's default account will be used.
   *  If an account_id is provided then it must be the guid
   *  version of the account number.
   *  Default: false  */
  , targetAccountId: false
  // The authentication server. DO NOT INCLUDE https:// prefix!
  , authServer: env.DS_AUTH_SERVER || 'account-d.docusign.com'
    /** The same value must be set as a redirect URI in the
     *  DocuSign admin tool. This setting is <b>only</b> used for individually granting
     *  permission to the clientId if organizational-level permissions
     *  are not used.
     *  <br><b>Default:</b> <tt>https://www.docusign.com</tt> */
  , oAuthConsentRedirectURI: 'http://localhost'
}
