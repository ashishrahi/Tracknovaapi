export const SUCCESS = {
    CREATE: (entity = "Record") => `${entity} created successfully.`,
    CREATE_WITH_NAME: (entity = "Record", name = "") => `${entity} ${name} created successfully.`,
  
    FETCH_ALL: (entity = "Records") => `${entity} retrieved successfully.`,
    FETCH_ONE: (entity = "Record") => `${entity} retrieved successfully.`,
    FETCH_ONE_WITH_NAME: (entity = "Record", name = "") => `${entity} ${name} retrieved successfully.`,
  
    UPDATE: (entity = "Record") => `${entity} updated successfully.`,
    UPDATE_WITH_NAME: (entity = "Record", name = "") => `${entity} ${name} successfully updated.`,
  
    DELETE: (entity = "Record") => `${entity} deleted successfully.`,
    DELETE_WITH_NAME: (entity = "Record", name = "") => `${entity} ${name} successfully deleted.`,
  };
  
  export const ERROR = {
    CREATE: (entity = "record") => `Failed to create ${entity}.`,
    FETCH: (entity = "records") => `Failed to fetch ${entity}.`,
    NOT_FOUND: (entity = "Record") => `${entity} not found.`,
  
    UPDATE: (entity = "record") => `Failed to update ${entity}.`,
    DELETE: (entity = "record") => `Failed to delete ${entity}.`,
  
    VALIDATION: () => "Validation failed.",
    ALREADY_EXISTS: (entity = "Record") => `${entity} already exists.`,
    ALREADY_EXISTS_WITH_NAME: (entity = "Record", name = "") => `${entity} ${name} already exists.`,
  
    DB: () => "Database error occurred.",
    SERVER: () => "Internal server error.",
    UNAUTHORIZED: () => "Unauthorized access.",
    FORBIDDEN: () => "Forbidden: insufficient permissions.",
  };
  