import { ethers } from "ethers";

/**
 * Checks if the address passed is a valid, non ICAP address (ICAP is some other format we dont want)
 *
 * @param address address to check
 * @returns true if valid non-ICAP address, false if ICAP or invalid address.
 */
export function isValidNonICAPEthereumAddress(address: string): boolean {
  try {
    const checkSummedAddress = ethers.utils.getAddress(address.toLowerCase());

    if (address.substring(0, 2) === "0x") {
      let isICAPAddress =
        ethers.utils.getIcapAddress(checkSummedAddress) === address;
      return !isICAPAddress;
    }
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Given an object, array or string will recurse over each value and if its an address it will
 * turn it into a checksummed address.
 *
 * @param theObject the object to process
 * @returns the object with the address fields checksummed
 */
export function convertObjectAddressesToChecksummedAddresses(
  theObject: any
): any {
  if (Array.isArray(theObject)) {
    return theObject.map((value) =>
      convertObjectAddressesToChecksummedAddresses(value)
    );
  } else if (theObject && theObject.constructor === Object) {
    const object: {
      [key: string]: any;
    } = {};

    for (const key of Object.keys(theObject)) {
      object[key] = convertObjectAddressesToChecksummedAddresses(
        theObject[key]
      );
    }
    return object;
  } else {
    if (typeof theObject === "string") {
      return getChecksummedAddress(theObject);
    }
    return theObject;
  }
}

/**
 * Given a string returns an address which is checksummed or the original string
 *
 * @param value the value of the string to checksum
 * @returns the checksummed value
 */
export function getChecksummedAddress(value: string) {
  if (ethers.utils.isAddress(value.toLowerCase())) {
    return ethers.utils.getAddress(value.toLowerCase());
  }
  return value;
}
