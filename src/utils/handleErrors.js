export const handleErrors = (errorResponse, errorsRef) => {
    const errorMessages = {};
    if (errorResponse) {
        for (let field in errorResponse) {
            if (errorResponse[field].length > 0) {
              errorMessages[field] = errorResponse[field][0];
            }
          }
    }
    Object.assign(errorsRef.value, errorMessages);
};