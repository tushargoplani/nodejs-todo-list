exports.apiFailureMessage = {
  SOMETHING_WENT_WRONG: "Something went wrong",
  USER_ALREADY_EXISTS: "User already exists",
  USER_NOT_FOUND: "User not found",
  INCORRECT_PASSWORD: "Password is incorrect",
  TOKEN_NOT_PROVIDED: "Token not provided",
  AUTHENTICATION_FAILED: "Authentication failed",
  CREATE_TASK_PERMISSION_ERROR: "You do not have permission to create the task",
  UPDATE_TASK_PERMISSION_ERROR: "You do not have permission to update this task",
  ASSIGNEE_NOT_FOUND: "Assignee not found",
  TASK_NOT_FOUND: 'Task not found',
  TOKEN_EXPIRED: 'Token expired',
  KEY_AND_VALUE_ARE_REQUIRED: 'Key and value are required to save data in redis',
  KEY_IS_REQUIRED: 'Key is required to fetch data from redis',
};

exports.apiSuccessMessage = {
  USER_SUCCESSFULLY_SIGNEDUP: "User successfully signed up",
  USER_SAVED_SUCCESSFULLY: "User saved successfully",
  USER_LOGGED_IN_SUCCESSFULLY: "User logged in successfully",
  TASK_CREATED_SUCCESSFULLY: 'Task created successfully',
  TASK_DELETED_SUCCESSFULLY: 'Task deleted successfully',
  TASK_UPDATED_SUCCESSFULLY: 'Task updated successfully',
  TASKS_FETCHED_SUCCESSFULLY: 'Tasks fetched successfully',
};

exports.collectionNames = {
  userCollection: "users",
  taskCollection: "tasks",
};
