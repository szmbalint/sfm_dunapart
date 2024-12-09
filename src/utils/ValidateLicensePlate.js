// A mintázat: három betű, kötőjel, három szám (pl. ABC-123)
const licensePlatePattern = /^[A-Z]{3}-\d{3}$/;

/**
 * Ellenőrzi a rendszám formátumát és nagybetűssé alakítja.
 * @param {string} licensePlate - Az ellenőrizni kívánt rendszám.
 * @returns {string} - A nagybetűssé alakított, érvényes rendszám.
 * @throws {Error} - Ha a rendszám formátuma helytelen.
 */
export function validateLicensePlate(licensePlate) {
  const upperCasePlate = licensePlate.trim().toUpperCase(); // Nagybetűssé alakítás

  if (!licensePlatePattern.test(upperCasePlate)) {
    throw new Error("Incorrect license plate format! Please use: ABC-123");
  }

  return upperCasePlate; // Érvényes rendszám visszaadása
}
