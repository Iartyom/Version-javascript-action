const constants = require('./constants');
const octokitApiWrapper = require('./octokit-api-wrapper');
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
    
    const splittedRepository = REPOSITORY.toString().split("/");
    const OWNER = splittedRepository[0];
    const REPO = splittedRepository[1];
    
    core.info(`splittedRepository=${ JSON.stringify(splittedRepository) }`);
    core.info(`OWNER=${ OWNER }`);
    core.info(`REPO=${ REPO }`);

    const octokit = github.getOctokit(TOKEN);

    const branch = await octokitApiWrapper.getBranch(octokit, OWNER, REPO, BRANCH);

    const lastCommitMessage = branch.commit.commit.message;
    const latestBranchCommitSHA = branch.commit.sha;
    core.info(`lastCommitMessage=${ lastCommitMessage }`);
    core.info(`latestBranchCommitSHA=${ latestBranchCommitSHA }`);

    const step = utilities.commitMessageToStep(lastCommitMessage);
    core.info(`step=${ step }`)

    const beforeTags = await octokitApiWrapper.getTags(octokit, OWNER, REPO);
    core.info(`beforeTags=${ JSON.stringify(beforeTags) }`);

    var prevVersion = constants.INIT_VERSION;
    var major, minor, patch;
    [prevVersion, major, minor, patch] = parsers.parseVersion(prevVersion);
  
    if (beforeTags != null && beforeTags.length > 0) {
      const beforeLatestTag = beforeTags[0];
      const parsedTag = parsers.parseVersionFromTag(beforeLatestTag);

      if (parsedTag!=null) {
        [prevVersion, major, minor, patch] = parsedTag;
      }
    }
    core.info(`major=${ major }, minor=${ minor }, patch=${ patch }`);
    core.info(`prevVersion=${ prevVersion }`);

    const nextVersion = utilities.nextVersion(major, minor, patch, step);
    console.log(`nextVersion=${ JSON.stringify(nextVersion) }`);

    await octokitApiWrapper.createTag(octokit, OWNER, REPO, nextVersion, "", latestBranchCommitSHA, "commit")
    await octokitApiWrapper.createRef(octokit, OWNER, REPO, `refs/tags/${ nextVersion }`, latestBranchCommitSHA);

    const afterTags = await octokitApiWrapper.getTags(octokit, OWNER, REPO);
    afterTags.forEach(tag => {
      core.info(`tag.name=${ tag.name }`);
    });
  
    const afterTagsArray = Array.from(afterTags);
    
    if (afterTagsArray.length > 1) {
      const latestsTag = afterTagsArray[0];
      const latestsTagCommitSHA = latestsTag.commit.sha;

      const nextToLatestsTag = afterTagsArray[1];
      const nextToLatestsTagCommitSHA = nextToLatestsTag.commit.sha;

      core.info(`latestsTag=${ JSON.stringify(latestsTag) }`);
      core.info(`nextToLatestsTag=${ JSON.stringify(nextToLatestsTag) }`);

      core.info(`latestsTagCommitSHA=${ latestsTagCommitSHA }`);
      core.info(`nextToLatestsTagCommitSHA=${ nextToLatestsTagCommitSHA }`);

      const compare = await utilities.compareCommits(octokit, OWNER, REPO, nextToLatestsTagCommitSHA, latestsTagCommitSHA);
      core.info(`compare=${ JSON.stringify(compare) }`);

      const relevantPullRequestsSet = new Set();
    
      for (const commitFromCompare of compare.commits) {
        core.info(`commitFromCompare=${ JSON.stringify(commitFromCompare) }`);

        const commitFromCompareSHA = commitFromCompare.sha;

        const listPullRequestsAssociatedWithCommitFromCompare = await octokitApiWrapper.listPullRequestsAssociatedWithCommit(octokit, OWNER, REPO, commitFromCompareSHA);
        core.info(`listPullRequestsAssociatedWithCommitFromCompare=${ JSON.stringify(listPullRequestsAssociatedWithCommitFromCompare) }`);

        for (const pullRequestsAssociatedWithCommitFromCompare of listPullRequestsAssociatedWithCommitFromCompare) {

          const pullRequestNumber = pullRequestsAssociatedWithCommitFromCompare.number;
          core.info(`pullRequestNumber=${ JSON.stringify(pullRequestNumber) }`);

          const pullRequest_body = pullRequestsAssociatedWithCommitFromCompare.body;
          core.info(`pullRequest_body=${ JSON.stringify(pullRequest_body) }`);

          const parsedPull_requestBody = parsers.parsePullRequestBody(pullRequest_body);

          if (parsedPull_requestBody != null) {
            const jsonObject = JSON.stringify({ 
              number: pullRequestNumber,
              body: pullRequest_body,
              parsedPull_request: parsedPull_requestBody
            });
            core.info(`jsonObject=${ jsonObject }`);
      
            relevantPullRequestsSet.add(jsonObject);
          }
        }
      }

      core.info(`[...relevantPullRequestsSet]=${ JSON.stringify([...relevantPullRequestsSet]) }`);
      core.info(`[...relevantPullRequestsSet.keys()]=${ JSON.stringify([...relevantPullRequestsSet.keys()]) }`);
      core.info(`[...relevantPullRequestsSet.values()]=${ JSON.stringify([...relevantPullRequestsSet.values()]) }`);
    
      const date = utilities.getFormattedDate();
      core.info(`date=${ date }`);

      const changelog = utilities.generateChangeLog(relevantPullRequestsSet, nextVersion, date);
      core.info(`changelog=${ JSON.stringify(changelog) }`);

      await utilities.updateMonday(relevantPullRequestsSet, nextVersion);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
