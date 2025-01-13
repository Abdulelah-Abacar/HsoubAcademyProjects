export const validate = (title, content, setValidationErrors) => {
  const validationErrors = [];
  let passed = true;
  if (!title) {
    validationErrors.push('الرجاء إدخال عنوان الملاحظة');
    passed = false;
  }
  if (!content) {
    validationErrors.push('الرجاء إدخال محتوى الملاحظة');
    passed = false;
  }
  setValidationErrors(validationErrors);
  return passed;
};