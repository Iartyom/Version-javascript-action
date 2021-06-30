const constants = require('./constants');
const monday_api_wrapper = require('./monday_api_wrapper');
const monday_constants = require('./monday_constants');
const octokit_api_wrapper = require('./octokit_api_wrapper');
const parsers = require('./parsers');
const utilities = require('./utilities');

const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  core.info(`Starting`);
  try {
    const REPOSITORY = process.env['GITHUB_REPOSITORY'] || ''
    core.info(`REPOSITORY=${ REPOSITORY }`);
    
    const TOKEN = core.getInput('GH_TOKEN') || ''
    const BRANCH = core.getInput('BRANCH') || ''
    core.info(`TOKEN=${ TOKEN }`);
    core.info(`BRANCH=${ BRANCH }`);
    
    const splitted_repository = REPOSITORY.toString().split("/");
    const OWNER = splitted_repository[0];
    const REPO = splitted_repository[1];
    
    core.info(`splitted_repository=${ JSON.stringify(splitted_repository) }`);
    core.info(`OWNER=${ OWNER }`);
    core.info(`REPO=${ REPO }`);

    const octokit = github.getOctokit(TOKEN);

    const branch = await octokit_api_wrapper.getBranch(octokit, OWNER, REPO, BRANCH);

    const last_commit_message = branch.commit.commit.message;
    const latest_branch_commit_sha = branch.commit.sha;
    core.info(`last_commit_message=${ last_commit_message }`);
    core.info(`latest_branch_commit_sha=${ latest_branch_commit_sha }`);

    const step = utilities.commit_message_to_step(last_commit_message);
    core.info(`step=${ step }`)

    const before_tags = await octokit_api_wrapper.getTags(octokit, OWNER, REPO);
    core.info(`before_tags=${ JSON.stringify(before_tags) }`);

    var prev_version = constants.INIT_VERSION;
    var major, minor, patch;
    [prev_version, major, minor, patch] = parsers.parseVersion(prev_version);
  
    if (before_tags != null && before_tags.length > 0) {
      const before_latest_tag = before_tags[0];
      const parsed_tag = parsers.parseVersionFromTag(before_latest_tag);

      if (parsed_tag!=null) {
        [prev_version, major, minor, patch] = parsed_tag;
      }
    }
    core.info(`major=${ major }, minor=${ minor }, patch=${ patch }`);
    core.info(`prev_version=${ prev_version }`);

    const next_version = utilities.nextVersion(major, minor, patch, step);
    console.log(`next_version=${ JSON.stringify(next_version, null, 2) }`);

    await octokit_api_wrapper.createTag(octokit, OWNER, REPO, next_version, "", latest_branch_commit_sha, "commit")
    await octokit_api_wrapper.createRef(octokit, OWNER, REPO, `refs/tags/${ next_version }`, latest_branch_commit_sha);

    const after_tags = await octokit_api_wrapper.getTags(octokit, OWNER, REPO);
    after_tags.forEach(tag => {
      core.info(`tag.name=${ tag.name }`);
    });
  
    const after_tags_array = Array.from(after_tags);
    const latests_tag = after_tags_array[0];
    const next_to_latests_tag = after_tags_array[1];
    const latests_tag_commit_sha = latests_tag.commit.sha;
    const next_to_latests_tag_commit_sha = next_to_latests_tag.commit.sha;

    core.info(`latests_tag=${ JSON.stringify(latests_tag, null, 2) }`);
    core.info(`next_to_latests_tag=${ JSON.stringify(next_to_latests_tag, null, 2) }`);

    core.info(`latests_tag_commit_sha=${ latests_tag_commit_sha }`);
    core.info(`next_to_latests_tag_commit_sha=${ next_to_latests_tag_commit_sha }`);

    const compare = await utilities.compareCommits(octokit, OWNER, REPO, next_to_latests_tag_commit_sha, latests_tag_commit_sha);
    core.info(`compare=${ JSON.stringify(compare, null, 2) }`);

    const relevant_pull_requests_set = new Set();
  
    for (const commit_from_compare of compare.commits) {
      core.info(`commit_from_compare=${ JSON.stringify(commit_from_compare, null, 2) }`);

      const commit_from_compare_sha = commit_from_compare.sha;

      const list_pull_requests_associated_with_commit_from_compare = await octokit_api_wrapper.listPullRequestsAssociatedWithCommit(octokit, OWNER, REPO, commit_from_compare_sha);
      core.info(`list_pull_requests_associated_with_commit_from_compare=${ JSON.stringify(list_pull_requests_associated_with_commit_from_compare, null, 2) }`);

      for (const pull_requests_associated_with_commit_from_compare of list_pull_requests_associated_with_commit_from_compare) {

        const pull_request_number = pull_requests_associated_with_commit_from_compare.number;
        core.info(`pull_request_number=${ JSON.stringify(pull_request_number, null, 2) }`);

        const pull_request_body = pull_requests_associated_with_commit_from_compare.body;
        core.info(`pull_request_body=${ JSON.stringify(pull_request_body, null, 2) }`);

        const parsed_pull_request_body = parsers.parsePullRequestBody(pull_request_body);

        if (parsed_pull_request_body != null) {
          const json_object = JSON.stringify({ 
            number: pull_request_number,
            body: pull_request_body,
            parsed_pull_request: parsed_pull_request_body
          });
          core.info(`json_object=${ json_object }`);
    
          relevant_pull_requests_set.add(json_object);
        }
      }
    }

    core.info(`[...relevant_pull_requests_set]=${ JSON.stringify([...relevant_pull_requests_set], null, 2) }`);
    core.info(`[...relevant_pull_requests_set.keys()]=${ JSON.stringify([...relevant_pull_requests_set.keys()], null, 2) }`);
    core.info(`[...relevant_pull_requests_set.values()]=${ JSON.stringify([...relevant_pull_requests_set.values()], null, 2) }`);
  
    const date = utilities.getFormattedDate();
    core.info(`date=${ date }`);

    const changelog = utilities.generateChangeLog(relevant_pull_requests_set, next_version, date);
    core.info(`changelog=${ JSON.stringify(changelog, null, 2) }`);

    await utilities.updateMonday(relevant_pull_requests_set, next_version);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
