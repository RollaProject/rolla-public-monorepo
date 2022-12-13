import { expect } from "chai";
import {
  isValidNonICAPEthereumAddress,
  convertObjectAddressesToChecksummedAddresses,
} from "../src/addressUtils";

describe("isValidNonICAPEthereumAddress", () => {
  it(`Should return true when the address is valid`, () => {
    let isValid = isValidNonICAPEthereumAddress(
      "0x372FFB3139dd312E7BED8A2259c9933baF15Ca2A"
    );
    expect(isValid).to.be.true;

    isValid = isValidNonICAPEthereumAddress(
      "0x372FFB3139dd312E7BED8A2259c9933baF15Ca2a"
    );
    expect(isValid).to.be.true;
  });

  it(`Should return false when the address is an invalid address`, () => {
    let isValid = isValidNonICAPEthereumAddress(
      "0x372FFB3139dd312E7BED8A2259c9933baF15Ca2"
    );
    expect(isValid).to.be.false;

    isValid = isValidNonICAPEthereumAddress(
      "372FFB3139dd312E7BED8A2259c9933baF15Ca2a"
    );
    expect(isValid).to.be.false;
  });

  it(`Should return false when the address is undefined or null`, () => {
    let isValid = isValidNonICAPEthereumAddress(undefined);
    expect(isValid).to.be.false;

    isValid = isValidNonICAPEthereumAddress(null);
    expect(isValid).to.be.false;
  });
});

describe("normalize addresses in json", () => {
  const nonCheckSummedAddress = "0x6a41FA71C44ee331E42a2eDAE15a67CB71CfD783";
  const checkSummedAddress = "0x6A41FA71C44ee331e42a2EDaE15A67cb71CfD783";

  const testObject = {
    key1: {
      key2: { key3: { key4: { key5: nonCheckSummedAddress } } },
      key6: nonCheckSummedAddress,
      key7: "Some other value that doesnt matter",
      key8: 1,
    },
    key9: {
      key10: "KeY7",
      key11: "keY9",
      key12: [
        "some",
        "ArraY",
        "ValueeE",
        { key13: "ObjectvaluE" },
        1,
        nonCheckSummedAddress,
        checkSummedAddress,
      ],
      key14: {
        key15: "val",
        key16: "otherval",
        nonCheckSummedAddress,
        checkSummedAddress,
      },
    },
    key17: [1, 2, 3, "somevalue"],
    key18: null,
  };

  // replace instances of non checksummed address with checksummed address
  const output = JSON.stringify(testObject).replace(
    new RegExp(nonCheckSummedAddress, "g"),
    checkSummedAddress
  );

  it(`Should checksum addresses in json object`, () => {
    expect(
      JSON.stringify(convertObjectAddressesToChecksummedAddresses(testObject))
    ).to.be.eq(output);
  });
});
