import instance from "../lib/axios";

/*
  User Onboarding Component APIs - APIs Used in User Onboarding Component
*/
const onboarding_userRegister = async (params) => {
  return await instance.clientOnboarding.post("/auth/register", params, {
    headers: instance.defaultHeaders(),
  });
};

const onboarding_userLogin = async (params) => {
  return await instance.clientOnboarding.post("/auth/login", params, {
    headers: instance.defaultHeaders(),
  });
};
/*
  End of User Onboarding Component APIs - End of APIs Used in User Onboarding Component
*/

const privateAPI = {
  /*
    User Onboarding Component APIs - APIs Used in User Onboarding Component
  */
  onboarding_userRegister,
  onboarding_userLogin,
  /*
    End of User Onboarding Component APIs - APIs Used in User Onboarding Component
  */
};

export default privateAPI;
