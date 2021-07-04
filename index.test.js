const constants = require('./constants');
const tokens = require('../tokens/tokens');
const octokitApiWrapper = require('./octokit-api-wrapper');
const parsers = require('./parsers');
const utilities = require('./utilities');

const github = require('@actions/github');
const lodash = require('lodash');


console.log(`constants.REPOSITORY=${ constants.REPOSITORY }`);

const splittedRepository = constants.REPOSITORY.toString().split("/");
const OWNER = splittedRepository[0];
const REPO = splittedRepository[1];
console.log(`splittedRepository=${ JSON.stringify(splittedRepository) }`);
console.log(`OWNER=${ OWNER }`);
console.log(`REPO=${ REPO }`);

test('test getOctokit', async () => {
  const token = tokens.GITHUB_TOKEN;
  
  const octokit = github.getOctokit(token);

  const branch = await octokitApiWrapper.getBranch(octokit, OWNER, REPO, constants.BRANCH);

  const lastCommitMessage = branch.commit.commit.message;
  const latestBranchCommitSHA = branch.commit.sha;
  console.log(`lastCommitMessage=${ lastCommitMessage }`);
  console.log(`latestBranchCommitSHA=${ latestBranchCommitSHA }`);

  const step = utilities.commitMessageToStep(lastCommitMessage);
  console.log(`step=${ step }`)

  var beforeTags = await octokitApiWrapper.getTags(octokit, OWNER, REPO);
  console.log(`beforeTags=${ JSON.stringify(beforeTags) }`);

  const filteredBeforeTags = beforeTags.filter(tag => {
    console.log(`tag=${ JSON.stringify(tag) }`);
    console.log(`tag.name=${ JSON.stringify(tag.name) }`);
    const tagAfterVersionRegexExec = constants.VERSION_REGEX.exec(tag.name);
    console.log(`tagAfterVersionRegexExec=${ JSON.stringify(tagAfterVersionRegexExec) }`);
    if (tagAfterVersionRegexExec != null && tagAfterVersionRegexExec.length != null) {
      return true;
    }
    return false;
  });
  console.log(`filteredBeforeTags=${ JSON.stringify(filteredBeforeTags) }`);

  var prevVersion = constants.INIT_VERSION;
  var major, minor, patch;
  [prevVersion, major, minor, patch] = parsers.parseVersion(prevVersion);
  
  if (filteredBeforeTags != null && filteredBeforeTags.length > 0) {
    const beforeLatestTag = beforeTags[0];
    
    const parsedTag = parsers.parseVersionFromTag(beforeLatestTag);

    if (parsedTag!=null) {
      [prevVersion, major, minor, patch] = parsedTag;
    }
  }
  console.log(`major=${ major }, minor=${ minor }, patch=${ patch }`);
  console.log(`prevVersion=${ prevVersion }`);

  const nextVersion = utilities.nextVersion(major, minor, patch, step);
  console.log(`nextVersion=${ JSON.stringify(nextVersion) }`);

  await octokitApiWrapper.createTag(octokit, OWNER, REPO, nextVersion, "", latestBranchCommitSHA, "commit")
  await octokitApiWrapper.createRef(octokit, OWNER, REPO, `refs/tags/${ nextVersion }`, latestBranchCommitSHA);

  const afterTags = await octokitApiWrapper.getTags(octokit, OWNER, REPO);
  lodash.forEach(tag => {
    core.info(`tag.name=${ tag.name }`);
  });

  const filteredAfterTags = afterTags.filter(tag => {
    console.log(`tag=${ JSON.stringify(tag) }`);
    console.log(`tag.name=${ JSON.stringify(tag.name) }`);
    const tagAfterVersionRegexExec = constants.VERSION_REGEX.exec(tag.name);
    console.log(`tagAfterVersionRegexExec=${ JSON.stringify(tagAfterVersionRegexExec) }`);
    if (tagAfterVersionRegexExec != null && tagAfterVersionRegexExec.length != null) {
      return true;
    }
    return false;
  });
  console.log(`filteredAfterTags=${ JSON.stringify(filteredAfterTags) }`);

  // await deleteTags(octokit, OWNER, REPO);
  // await deleteSliceOfTags(octokit, OWNER, REPO, 1, -1);
})

test('test pull request parser', async () => {
  jest.setTimeout(10000);

  const token = tokens.GITHUB_TOKEN;;
  const octokit = github.getOctokit(token);

  const branch = await octokitApiWrapper.getBranch(octokit, OWNER, REPO, constants.BRANCH);

  const tags = await octokitApiWrapper.getTags(octokit, OWNER, REPO);
  console.log(`tags=${ JSON.stringify(tags) }`);

  const tagsArray = Array.from(tags);
  const afterTagsArray = Array.from(tagsArray);
    
  if (afterTagsArray.length > 1) {
    const latestsTag = afterTagsArray[0];
    const latestsTagCommitSHA = latestsTag.commit.sha;

    const nextToLatestsTag = afterTagsArray[1];
    const nextToLatestsTagCommitSHA = nextToLatestsTag.commit.sha;

    console.log(`latestsTag=${ JSON.stringify(latestsTag) }`);
    console.log(`nextToLatestsTag=${ JSON.stringify(nextToLatestsTag) }`);

    console.log(`latestsTagCommitSHA=${ latestsTagCommitSHA }`);
    console.log(`nextToLatestsTagCommitSHA=${ nextToLatestsTagCommitSHA }`);

    const compare = await utilities.compareCommits(octokit, OWNER, REPO, nextToLatestsTagCommitSHA, latestsTagCommitSHA);
    console.log(`compare=${ JSON.stringify(compare) }`);

    const relevantPullRequestsSet = new Set();
    
    lodash.forEach(compare.commits, (commitFromCompare) => {
      console.log(`commitFromCompare=${ JSON.stringify(commitFromCompare) }`);

      const commitFromCompareSHA = commitFromCompare.sha;

      const listPullRequestsAssociatedWithCommitFromCompare = octokitApiWrapper.listPullRequestsAssociatedWithCommit(octokit, OWNER, REPO, commitFromCompareSHA);
      console.log(`listPullRequestsAssociatedWithCommitFromCompare=${ JSON.stringify(listPullRequestsAssociatedWithCommitFromCompare) }`);

      lodash.forEach(listPullRequestsAssociatedWithCommitFromCompare, (pullRequestsAssociatedWithCommitFromCompare) => {
        const pullRequestNumber = pullRequestsAssociatedWithCommitFromCompare.number;
        console.log(`pullRequestNumber=${ JSON.stringify(pullRequestNumber) }`);

        const pullRequestBody = pullRequestsAssociatedWithCommitFromCompare.body;
        console.log(`pullRequestBody=${ JSON.stringify(pullRequestBody) }`);

        const parsedPullRequestBody = parsers.parsePullRequestBody(pullRequestBody);

        if (parsedPullRequestBody != null) {
          const jsonObject = JSON.stringify({ 
            number: pullRequestNumber,
            body: pullRequestBody,
            parsedPullRequest: parsedPullRequestBody
          });
          console.log(`jsonObject=${ jsonObject }`);
    
          relevantPullRequestsSet.add(jsonObject);
        }
      });
    });

    console.log(`[...relevantPullRequestsSet]=${ JSON.stringify([...relevantPullRequestsSet]) }`);
    console.log(`[...relevantPullRequestsSet.keys()]=${ JSON.stringify([...relevantPullRequestsSet.keys()]) }`);
    console.log(`[...relevantPullRequestsSet.values()]=${ JSON.stringify([...relevantPullRequestsSet.values()]) }`);
  
    const date = utilities.getFormattedDate();
    console.log(`date=${ date }`);

    const changelog = utilities.generateChangeLog(relevantPullRequestsSet, "0.0.1", date);
    console.log(`changelog=${ JSON.stringify(changelog) }`);

    await utilities.updateMonday(relevantPullRequestsSet, "0.0.1");
  }
})




