/**
 * Calculates the age based on the birthdate
 * @param dateString takes birthdate as input
 */
export function calculateAge(dateString: string): number {
  const dateToday = new Date();
  const birthDate = new Date(dateString);
  let age = dateToday.getFullYear() - birthDate.getFullYear();
  const month = dateToday.getMonth() - birthDate.getMonth();

  if (month < 0 || (month === 0 && dateToday.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}
