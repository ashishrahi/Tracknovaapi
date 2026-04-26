const authControllerResponse = {
    notFound: "Username not found",
    /** When `workspaceSlug` / `companyCode` selected a company but no matching IdP user exists. */
    notFoundInWorkspace: "Username not found in this workspace",
    inValidIdp: "Provide valid username and password",
    loginSuccess: "Login successful"
}

export default authControllerResponse