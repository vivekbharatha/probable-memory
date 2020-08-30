module.exports.validateRegisterInput = ({ username, email, password, confirmPassword }) => {
  const errors = {};
  if (username.trim() === '') {
    errors.username = 'Username must no be empty';
  }

  if (email.trim() === '') {
    errors.email = 'Email must no be empty';
  } else {
    const regex = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regex)) {
      errors.email = 'Email must be a valid address';
    }
  }

  if (password === '') {
    errors.password = 'Password must not be empty';
  } else if (password !== confirmPassword) {
    errors.password = 'Passwords must match';
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};
