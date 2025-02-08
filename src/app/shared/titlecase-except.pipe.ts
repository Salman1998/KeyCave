import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titlecaseExcept'
})
export class TitlecaseExceptPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    // Words to exclude from capitalization
    const excludeWords = ['of'];

    // Split the string into words
    let words = value.split(' ');

    // Capitalize the first letter of each word unless it's in the excludeWords array
    words = words.map((word, index) => {
      if (index === 0 || !excludeWords.includes(word.toLowerCase())) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.toLowerCase();
    });

    // Join the words back into a single string
    return words.join(' ');
  }

  transformPhoneNumber(phone: string): string | null {
    // Remove non-numeric characters
    let cleanPhone = phone.replace(/\D/g, '');

    // Check if the number starts with a "1" and remove it
    if (cleanPhone.startsWith('1')) {
      cleanPhone = cleanPhone.substring(1);
    }

    // Return nothing if the number is longer than 15 digits
    if (cleanPhone.length > 10 || cleanPhone.length < 10) {
      return null;
    }

    // Format the number (XXX)-XXX-XXXX
    const areaCode = cleanPhone.substring(0, 3);
    const centralOfficeCode = cleanPhone.substring(3, 6);
    const lineNumber = cleanPhone.substring(6);

    return `(${areaCode})-${centralOfficeCode}-${lineNumber}`;
  }

}
