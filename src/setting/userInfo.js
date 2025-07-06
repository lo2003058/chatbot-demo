const userInfo = {
  companies: [
    {
      id: 1,
      name: 'Token exists',
      token: '12345'
    },
    {
      id: 2,
      name: 'Token not exists',
      token: ''
    }
  ],

  // Helper function to validate token
  validateToken(token) {
    return this.companies.find(company => company.token === token);
  },

  // Get company by token
  getCompanyByToken(token) {
    return this.companies.find(company => company.token === token);
  }
};

export default userInfo;
