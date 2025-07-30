// Role checking utilities to handle both lowercase and capitalized role names
// Backend returns: "Administrator", "Employer", "Applicant"
// Frontend might use: "admin", "employer", "applicant"

export const isAdmin = (role?: string): boolean => {
  return role === 'admin' || role === 'Administrator';
};

export const isEmployer = (role?: string): boolean => {
  return role === 'employer' || role === 'Employer';
};

export const isApplicant = (role?: string): boolean => {
  return role === 'applicant' || role === 'Applicant';
};

export const canAccessAdmin = (role?: string): boolean => {
  return isAdmin(role);
};

export const canAccessEmployer = (role?: string): boolean => {
  return isEmployer(role) || isAdmin(role);
};

export const canCreateJobs = (role?: string): boolean => {
  return isEmployer(role) || isAdmin(role);
};

export const canManageScholarships = (role?: string): boolean => {
  return isAdmin(role);
};

export const canApplyToOpportunities = (role?: string): boolean => {
  return isApplicant(role);
};

// Get normalized role name (always lowercase for consistency)
export const getNormalizedRole = (role?: string): string => {
  if (!role) return '';

  switch (role.toLowerCase()) {
    case 'administrator':
    case 'admin':
      return 'admin';
    case 'employer':
      return 'employer';
    case 'applicant':
      return 'applicant';
    default:
      return role.toLowerCase();
  }
};
