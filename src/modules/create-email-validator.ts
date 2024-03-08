// eslint-disable-next-line no-useless-escape
const emailExpressionRules: RegExp = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

export const emailValidator = (email: string): boolean => {
  if (!email) return false;

  const emailParts: string[] = email.split("@");

  if (emailParts.length !== 2) return false;

  const account = emailParts[0];
  const address = emailParts[1];

  if (!account || !address) return false;

  if (account.length > 64) return false;
  else if (address.length > 255) return false;

  const domainParts: string[] = address.split(".");

  if (domainParts.some((part: string) => part.length > 63)) return false;

  return emailExpressionRules.test(email);
};

export const emailTester: RegExp = emailExpressionRules;
