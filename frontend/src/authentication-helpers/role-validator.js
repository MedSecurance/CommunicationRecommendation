const rolePermissions = {
    Admin: {
      'RiskAssessment': ['insert', 'delete', 'update', 'view'],
      'DeviceManager': ['insert', 'delete', 'update', 'view'],
      'AdminConfigPanel': ['insert', 'delete', 'update', 'view']
    },
    User: {
      'RiskAssessment': ['insert', 'delete', 'update', 'view'],
      'DeviceManager': ['insert', 'delete', 'update', 'view'],
      'AdminConfigPanel': ['insert', 'delete', 'update', 'view']
    },
    SecurityAnalyst: {
      'RiskAssessment': ['view'],
      'DeviceManager': ['view'],
      'AdminConfigPanel': []
    },
    RegulatoryBodies: {
      'RiskAssessment': ['view'],
      'DeviceManager': ['view'],
      'AdminConfigPanel': []
    }
  };

  export const hasPermission = (roles, tool, action) => {
    for (const role of roles) {
      const permissions = rolePermissions[role];
      if (permissions && permissions[tool]?.includes(action)) {
        return true;
      }
    }
    return false;
  };