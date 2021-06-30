const constants = require('./constants');
const monday_api_wrapper = require('./monday_api_wrapper');
const monday_constants = require('./monday_constants');
const tokens = require('../tokens/tokens');
const octokit_api_wrapper = require('./octokit_api_wrapper');
const parsers = require('./parsers');
const utilities = require('./utilities');

const github = require('@actions/github');

console.log(`constants.REPOSITORY=${ constants.REPOSITORY }`);

const splitted_repository = constants.REPOSITORY.toString().split("/");
const OWNER = splitted_repository[0];
const REPO = splitted_repository[1];
console.log(`splitted_repository=${ JSON.stringify(splitted_repository, null, 2) }`);
console.log(`OWNER=${ OWNER }`);
console.log(`REPO=${ REPO }`);

test('test getOctokit', async () => {
  let reader = new FileReader();
  const token = tokens.GITHUB_TOKEN;
  const octokit = github.getOctokit(token);

  const branch = await octokit_api_wrapper.getBranch(octokit, OWNER, REPO, constants.BRANCH);

  const last_commit_message = branch.commit.commit.message;
  const latest_branch_commit_sha = branch.commit.sha;
  console.log(`last_commit_message=${ last_commit_message }`);
  console.log(`latest_branch_commit_sha=${ latest_branch_commit_sha }`);

  const step = utilities.commit_message_to_step(last_commit_message);
  console.log(`step=${ step }`)

  const before_tags = await octokit_api_wrapper.getTags(octokit, OWNER, REPO);
  console.log(`before_tags=${ JSON.stringify(before_tags, null, 2) }`);

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
  console.log(`major=${ major }, minor=${ minor }, patch=${ patch }`);
  console.log(`prev_version=${ prev_version }`);

  const next_version = utilities.nextVersion(major, minor, patch, step);
  console.log(`next_version=${ JSON.stringify(next_version, null, 2) }`);

  await octokit_api_wrapper.createTag(octokit, OWNER, REPO, next_version, "", latest_branch_commit_sha, "commit")
  await octokit_api_wrapper.createRef(octokit, OWNER, REPO, `refs/tags/${ next_version }`, latest_branch_commit_sha);

  const after_tags = await octokit_api_wrapper.getTags(octokit, OWNER, REPO);
  after_tags.forEach(tag => {
    console.log(`tag.name=${ tag.name }`);
  });

  // await deleteTags(octokit, OWNER, REPO);
  // await deleteSliceOfTags(octokit, OWNER, REPO, 1, -1);
})

test('test pull request parser', async () => {
  jest.setTimeout(10000);

  const token = tokens.GITHUB_TOKEN;;
  const octokit = github.getOctokit(token);

  const branch = await octokit_api_wrapper.getBranch(octokit, OWNER, REPO, constants.BRANCH);

  const tags = await octokit_api_wrapper.getTags(octokit, OWNER, REPO);
  console.log(`tags=${ JSON.stringify(tags, null, 2) }`);

  const tags_array = Array.from(tags);
  const latests_tag = tags_array[0];
  const next_to_latests_tag = tags_array[1];
  const latests_tag_commit_sha = latests_tag.commit.sha;
  const next_to_latests_tag_commit_sha = next_to_latests_tag.commit.sha;

  console.log(`latests_tag=${ JSON.stringify(latests_tag, null, 2) }`);
  console.log(`next_to_latests_tag=${ JSON.stringify(next_to_latests_tag, null, 2) }`);

  console.log(`latests_tag_commit_sha=${ latests_tag_commit_sha }`);
  console.log(`next_to_latests_tag_commit_sha=${ next_to_latests_tag_commit_sha }`);

  const compare = await utilities.compareCommits(octokit, OWNER, REPO, next_to_latests_tag_commit_sha, latests_tag_commit_sha);
  console.log(`compare=${ JSON.stringify(compare, null, 2) }`);

  const relevant_pull_requests_set = new Set();
  
  for (const commit_from_compare of compare.commits) {
    console.log(`commit_from_compare=${ JSON.stringify(commit_from_compare, null, 2) }`);

    const commit_from_compare_sha = commit_from_compare.sha;

    const list_pull_requests_associated_with_commit_from_compare = await octokit_api_wrapper.listPullRequestsAssociatedWithCommit(octokit, OWNER, REPO, commit_from_compare_sha);
    console.log(`list_pull_requests_associated_with_commit_from_compare=${ JSON.stringify(list_pull_requests_associated_with_commit_from_compare, null, 2) }`);

    for (const pull_requests_associated_with_commit_from_compare of list_pull_requests_associated_with_commit_from_compare) {

      const pull_request_number = pull_requests_associated_with_commit_from_compare.number;
      console.log(`pull_request_number=${ JSON.stringify(pull_request_number, null, 2) }`);

      const pull_request_body = pull_requests_associated_with_commit_from_compare.body;
      console.log(`pull_request_body=${ JSON.stringify(pull_request_body, null, 2) }`);

      const parsed_pull_request_body = parsers.parsePullRequestBody(pull_request_body);

      if (parsed_pull_request_body != null) {
        const json_object = JSON.stringify({ 
          number: pull_request_number,
          body: pull_request_body,
          parsed_pull_request: parsed_pull_request_body
        });
        console.log(`json_object=${ json_object }`);
    
        relevant_pull_requests_set.add(json_object);
      }
    }
  }

  console.log(`[...relevant_pull_requests_set]=${ JSON.stringify([...relevant_pull_requests_set], null, 2) }`);
  console.log(`[...relevant_pull_requests_set.keys()]=${ JSON.stringify([...relevant_pull_requests_set.keys()], null, 2) }`);
  console.log(`[...relevant_pull_requests_set.values()]=${ JSON.stringify([...relevant_pull_requests_set.values()], null, 2) }`);
  
  const date = utilities.getFormattedDate();
  console.log(`date=${ date }`);

  const changelog = utilities.generateChangeLog(relevant_pull_requests_set, "0.0.1", date);
  console.log(`changelog=${ JSON.stringify(changelog, null, 2) }`);

  await utilities.updateMonday(relevant_pull_requests_set, "0.0.1");
})




