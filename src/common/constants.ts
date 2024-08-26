export enum userRoles {
  Admin = 'admin',
  Manager = 'manager',
  Employee = 'employee',
}

export const roleHierarchy = {
  [userRoles.Admin]: [userRoles.Admin, userRoles.Manager, userRoles.Employee],
  [userRoles.Manager]: [userRoles.Manager, userRoles.Employee],
  [userRoles.Employee]: [userRoles.Employee],
};
