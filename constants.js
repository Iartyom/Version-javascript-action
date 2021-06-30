const INIT_VERSION = "v0.0.0";
const FIRST_VERSION = "v0.0.1";

const VERSION_REGEX = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/i
const STEP_REGEX = /^\[(.*)\]/i

const PR_DESCRIPTION_SECTION_REGEX = /Description[^#]*/g;
const PR_DESCRIPTION_LINE_REGEX = /Description[^#]*/g;
const COMMENT_REGEX = /(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g;
const PR_DESCRIPTION_LINES_REGEX = /\*\s*([a-zA-Z]*)\s*:\s*([^\n\r]*)/g;
const PR_MONDAY_LINKS_REGEX = /[^\(\s]*https:\/\/.*monday.com[^\)\s]*/g;

const BRANCH = 'master';

const REPOSITORY="Explium/tests"

module.exports = { INIT_VERSION,
  FIRST_VERSION,
  VERSION_REGEX,
  STEP_REGEX,
  PR_DESCRIPTION_SECTION_REGEX,
  PR_DESCRIPTION_LINE_REGEX,
  COMMENT_REGEX,
  PR_DESCRIPTION_LINES_REGEX,
  PR_MONDAY_LINKS_REGEX,
  BRANCH,
  REPOSITORY
};
