
const { pool } = require("../config/database");

/**
 * Generate a unique Contact ID with format "C0005" (always 5 characters)
 */
async function generateUniqueContactId(connection) {
  let contactId;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 100;

  while (!isUnique && attempts < maxAttempts) {
    const randomNum = Math.floor(0 + Math.random() * 10000); // 0 to 9999
    const paddedNum = String(randomNum).padStart(4, "0");     // e.g., "0005", "0421"
    contactId = `C${paddedNum}`;                              // Final: "C0005"

    console.log("→ contactId:", contactId, "| Length:", contactId.length); // DEBUG

    const [existing] = await connection.execute(
      "SELECT 1 FROM contact_person_details WHERE Contact_ID = ?",
      [contactId]
    );

    if (existing.length === 0) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    throw new Error("Failed to generate unique Contact_ID after maximum attempts");
  }

  return contactId;
}

module.exports = {
  generateUniqueContactId
};
