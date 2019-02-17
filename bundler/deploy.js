const deployToGhPages = require('./utils/deploy_to_gh_pages');
const DST_PATH = require('./config');

deployToGhPages(DST_PATH)
  .catch(() => {
    process.exit(1);
  });
