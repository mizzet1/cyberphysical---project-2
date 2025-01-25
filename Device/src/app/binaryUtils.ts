export class BinaryUtils {

  // XOR two strings in binary format
static xor_BinaryStrings(binary1: string, binary2: string): string {
  if (binary1.length !== binary2.length) {
    throw new Error("Binary strings must be of the same length");
  }

  return binary1
    .split('') // Split the first binary string into individual bits
    .map((bit, index) => (bit === binary2[index] ? '0' : '1')) // XOR operation
    .join(''); // Join the result into a single binary string
}
  // Convert binary string --> hexadecimal string
static binary_ToHex(binaryString: string): string {
    // Validate the input to ensure it's a valid binary string
    if (!/^[01]+$/.test(binaryString)) {
      throw new Error("Invalid binary string");
    }

    // Pad the binary string to ensure its length is a multiple of 4
    const paddedBinary = binaryString.padStart(Math.ceil(binaryString.length / 4) * 4, '0');

    // Convert every 4 bits into a hexadecimal character
    return paddedBinary
      .match(/.{1,4}/g) // Split into groups of 4 bits
      ?.map(group => parseInt(group, 2).toString(16)) // Convert each group to hex
      .join('') // Join all hex characters into a single string
      .toUpperCase() || ''; // Return in uppercase
  }
  // Convert a Posivive Number --> 256 bit binary string
static Number_to256BitBinary(number: number): string {
  // Validate the input to ensure it's a valid number
  if (!Number.isInteger(number)) {
    throw new Error("Input must be an integer");
  }
  if (number < 0) {
    throw new Error("Input must be a non-negative integer");
  }

  // Convert the number to binary and pad to 256 bits
  return number.toString(2).padStart(256, '0');
}
  // Convert an Hexadecimal String --> 256 bit binary string
static Hex_to256BitBinary(hexString: string): string {
  // Validate the input to ensure it's a valid hexadecimal string
  // if (!/^[0-9a-fA-F]+$/.test(hexString)) {
  // console.log('hexString:'+ hexString);
  //   throw new Error("Invalid hexadecimal string");
  // }

  // Convert the hexadecimal string to binary
  const binaryString = hexString
    .split('') // Split the string into individual characters
    .map(char => parseInt(char, 16).toString(2).padStart(4, '0')) // Convert each hex digit to 4-bit binary
    .join(''); // Join all binary strings into a single string

  // Pad or truncate to 256 bits
  if (binaryString.length > 256) {
    console.log("binaryString is longer that 256: ", hexString)
    return binaryString.slice(0, 256); // Truncate if longer than 256 bits
  }
  return binaryString.padStart(256, '0'); // Pad to 256 bits
}
  // XOR two strings in Hexadecimal format
static xorHexStrings(hexString1: string, hexString2: string) : string{
  // Convert the hexadecimal strings to binary
  const hexString1_bin = this.Hex_to256BitBinary(hexString1);
  const hexString2_bin = this.Hex_to256BitBinary(hexString2);
  // XOR the binary strings
  const xor_bin = this.xor_BinaryStrings(hexString1_bin, hexString2_bin);
  // Convert the result back to hexadecimal
  const xor_hex = this.binary_ToHex(xor_bin);
  return xor_hex;
}
  
  }
  