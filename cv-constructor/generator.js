const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

// Register custom helpers for Handlebars
Handlebars.registerHelper('em', function (text) {
  return new Handlebars.SafeString(`<em>${text}</em>`);
});

// Main generation function
function generateCV() {
  try {
    // Read data and template files
    const dataPath = path.join(__dirname, 'data.json');
    const templatePath = path.join(__dirname, 'template.html');

    const rawData = fs.readFileSync(dataPath, 'utf8');
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const data = JSON.parse(rawData);

    // Compile template with Handlebars
    const template = Handlebars.compile(templateSource);

    // Create output directory
    const outputDir = path.join(__dirname, 'generated');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Generate files for each version
    Object.entries(data.versions).forEach(([versionKey, versionData]) => {
      console.log(`Generating CV version: ${versionKey}...`);

      // Merge personal data with version data
      const templateData = {
        ...data.personal,
        ...versionData
      };

      // Debug information
      console.log(`  - Skills: ${Object.keys(templateData.skills || {}).length} categories`);
      console.log(`  - Jobs: ${(templateData.jobs || []).length} positions`);
      console.log(`  - Achievements in first job: ${(templateData.jobs[0]?.achievements || []).length} items`);

      // Render template with Handlebars
      const html = template(templateData);

      // Save file
      const filename = `CV-${versionKey.toUpperCase()}-${data.personal.name.replace(/\s+/g, '-')}.html`;
      const filepath = path.join(outputDir, filename);

      fs.writeFileSync(filepath, html, 'utf8');
      console.log(`✅ Created file: ${filename}`);
    });

    console.log('\n🎉 All CV files successfully generated with Handlebars!');
    console.log(`📁 Files saved in folder: ${outputDir}`);

  } catch (error) {
    console.error('❌ Error generating CV:', error.message);
    console.error(error.stack);
  }
}

// Function for rendering with Handlebars (for export)
function renderTemplate(templateSource, data) {
  const template = Handlebars.compile(templateSource);
  return template(data);
}

// Run generation
if (require.main === module) {
  generateCV();
}

module.exports = { generateCV, renderTemplate }; 