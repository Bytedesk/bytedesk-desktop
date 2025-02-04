/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-29 11:11:37
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-04-29 11:50:48
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// import crypto from "crypto";

export function hashCode(name) {
  var hash = 0,
    i,
    chr;
  for (i = 0; i < name.length; i++) {
    chr = name.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

// export const hasher = (() => {
//   let password;
//   return {
//     hashCodeSalted(salt) {
//       if (!password) {
//         // password is created on first call.
//         password = randomizer.getRandomString(128);
//       }
//         //   return hashCode(salt);
//       return crypto
//         .createHash("sha3-512")
//         .update(password)
//         .update(
//           crypto.createHash("sha3-512").update(salt, "utf8").digest("hex"),
//         )
//         .digest("hex");
//     },
//   };
// })();

export const randomizer = (() => {
  let charCodeLettersOnly = (r) => 65 <= r && r <= 90;
  let charCodeAllPrintableChars = (r) =>
    r === 45 ||
    (47 <= r && r <= 57) ||
    (64 <= r && r <= 90) ||
    (97 <= r && r <= 122);

  return {
    getRandomString(length, lettersOnly = false) {
      const charCodeCondition = lettersOnly
        ? charCodeLettersOnly
        : charCodeAllPrintableChars;

      let string = "";
      while (string.length < length) {
        let arr = new Uint16Array(length);
        // crypto.webcrypto.getRandomValues(arr);
        arr = Array.apply([], arr); /* turn into non-typed array */
        arr = arr.map(function (r) {
          return r % 128;
        });
        arr = arr.filter(function (r) {
          /* strip non-printables: if we transform into desirable range we have a probability bias, so I suppose we better skip this character */
          return charCodeCondition(r);
        });
        string += String.fromCharCode.apply(String, arr);
      }
      return string.substring(0, length);
    },
  };
})();

/*
    cyrb53 (c) 2018 bryc (github.com/bryc)
    A fast and simple hash function with decent collision resistance.
    Largely inspired by MurmurHash2/3, but with a focus on speed/simplicity.
    Public domain. Attribution appreciated.
*/
export const cyrb53 = function (str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
