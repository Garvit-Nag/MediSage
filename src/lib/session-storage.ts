export const setUserPlan = (email: string, plan: string, expiryDate: string) => {
    const userPlanInfo = {
      email,
      plan,
      expiryDate
    };
    sessionStorage.setItem('userPlanInfo', JSON.stringify(userPlanInfo));
  };
  
  export const getUserPlan = () => {
    const planInfo = sessionStorage.getItem('userPlanInfo');
    return planInfo ? JSON.parse(planInfo) : { plan: 'basic', email: null, expiryDate: null };
  };