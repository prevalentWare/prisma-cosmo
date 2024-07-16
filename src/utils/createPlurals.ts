import fs from 'fs';

const createPlurals = async () => {
  // Define your array
  const array = ['apple', 'banana', 'cherry', 'grape'];

  // Define the path to the plurals.ts file
  const filePath = 'plurals.ts';

  // Function to parse the existing plurals object from the file
  function parsePlurals(content: string): { [key: string]: string } {
    const match = content.match(/export const plurals = (\{[\s\S]*?\});/);
    if (match) {
      // Extract the object content and ensure it is valid JSON
      const objectContent = match[1];
      const jsonString = objectContent
        .replace(/(\w+):/g, '"$1":') // Add double quotes around keys
        .replace(/,\s*}$/, '}') // Remove trailing commas before closing brace
        .replace(/'/g, '"'); // Replace single quotes with double quotes
      return JSON.parse(jsonString);
    }
    return {};
  }

  // Initialize the plurals object
  let plurals: { [key: string]: string } = {};

  // Check if plurals.ts file exists
  if (fs.existsSync(filePath)) {
    // Read the content of the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    plurals = parsePlurals(fileContent);
  } else {
    // If the file does not exist, create it with an empty plurals object
    fs.writeFileSync(filePath, 'export const plurals = {};\n', 'utf8');
  }

  // Add missing elements from the array to the plurals object
  array.forEach((item) => {
    if (!(item in plurals)) {
      plurals[item] = '';
    }
  });

  // Generate the updated content for the plurals.ts file
  let updatedContent = `export const plurals = ${JSON.stringify(
    plurals,
    null,
    2
  )};\n`;

  // Replace double quotes with single quotes in the final content
  updatedContent = updatedContent
    .replace(/"([^"]+)":/g, "'$1':")
    .replace(/"/g, "'");

  // Write the updated content back to the plurals.ts file
  fs.writeFileSync(filePath, updatedContent, 'utf8');

  console.log('plurals.ts file updated successfully.');
};

export { createPlurals };
