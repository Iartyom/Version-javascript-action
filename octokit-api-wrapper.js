async function createRef(octokit, owner, repo, ref, sha) {
  console.log(`owner=${ owner }, repo=${ repo }, ref=${ ref }, sha=${ sha }`);
  const response = await octokit.rest.git.createRef({
    owner: owner,
    repo: repo,
    ref: ref,
    sha: sha,
  });
  console.log(`response=${ JSON.stringify(response) }`);
}

async function createTag(octokit, owner, repo, tag, message, object, type) {
  const response = await octokit.rest.git.createTag({
    owner: owner,
    repo: repo,
    tag: tag,
    message: message,
    object: object,
    type: type
  });

  return response.status;
}

async function deleteRef(octokit, owner, repo, ref) {
  console.log(`owner=${ owner }, repo=${ repo }, ref=${ ref }`);

  const response = await octokit.rest.git.deleteRef({
    owner: owner,
    repo: repo,
    ref: ref
  });
  console.log(`response=${ JSON.stringify(response) }`);
}

async function deleteSliceOfTags(octokit, owner, repo, from, to, tags = null) {
  console.log(`owner=${ owner }, repo=${ repo }, from=${ from }, to=${ to }`);
  console.log(`tags=${ JSON.stringify(tags) }`);

  if (tags == null) {
    tags = await getTags(octokit, owner, repo);
    console.log(`tags=${ JSON.stringify(tags) }`);
  }

  for (const tag of tags.slice(from, to)) {
    console.log(`tag.name=${ tag.name }`);
    await deleteRef(octokit, owner, repo, `tags/${ tag.name }`);
  }
}

async function deleteTags(octokit, owner, repo, tags = null) {
  console.log(`owner=${ owner }, repo=${ repo }, tags=${ tags }`);

  if (tags == null) {
    tags = await getTags(octokit, owner, repo);
    console.log(`tags=${ JSON.stringify(tags) }`);
  }

  if (tags != null) {
    for (const tag of tags) {
      console.log(`tag.name=${ tag.name }`);
      await deleteRef(octokit, owner, repo, `tags/${ tag.name }`);
    }
  }
}

async function getBranch(octokit, owner, repo, branch) {
  console.log(`owner=${ owner }, repo=${ repo }, branch=${ branch }`);
  var resultBranch = null;

  const response = await octokit.rest.repos.getBranch({
    owner: owner,
    repo: repo,
    branch: branch
  })
  console.log(`response=${ JSON.stringify(response) }`);
  console.log(`response.status=${ JSON.stringify(response.status) }`);
  
  if (response.status == 200) {
    console.log(`if`);
    resultBranch = response.data;
    console.log(`response.data=${ JSON.stringify(response.data) }`);

  }
  console.log(`resultsBranch=${ JSON.stringify(resultBranch) }`);
  return resultBranch;
}

async function getCommit(octokit, owner, repo, commitSHA) {
  console.log(`owner=${ owner }, repo=${ repo }, commitSHA=${ commitSHA }`);

  var commit = null;
  
  const response = await octokit.rest.git.getCommit({
    owner,
    repo,
    commitSHA
  });
  console.log(`response=${ JSON.stringify(response) }`);

  if (response.status == 200) {
    commit = response.data;
  }

  console.log(`tags=${ JSON.stringify(commit) }`);
  return commit;
}

async function getPullRequest(octokit, owner, repo, pullNumber) {
  console.log(`owner=${ owner }, repo=${ repo }, pullNumber=${ pullNumber }`);

  var pullRequest = null;
  
  const response = await octokit.rest.pulls.get({
    owner: owner,
    repo: repo,
    pullNumber: pullNumber
  });
  console.log(`response=${ JSON.stringify(response) }`);

  if (response.status == 200) {
    pullRequest = response.data;
  }

  console.log(`pullRequest=${ JSON.stringify(pullRequest) }`);
  return pullRequest;
}

async function getPullsList(octokit, owner, repo) {
  console.log(`owner=${ owner }, repo=${ repo }`);

  var listPull_requests = null;
  
  const response = await octokit.rest.pulls.list({
    owner,
    repo
  });
  
  console.log(`response=${ JSON.stringify(response) }`);

  if (response.status == 200) {
    listPull_requests = response.data;
  }

  console.log(`listPull_requests=${ JSON.stringify(listPull_requests) }`);
  return listPull_requests;
}

async function getTags(octokit, owner, repo) {
  console.log(`owner=${ owner }, repo=${ repo }`);

  var tags = null;
  
  const response = await octokit.rest.repos.listTags({
    owner: owner,
    repo: repo
  });
  console.log(`response=${ JSON.stringify(response) }`);

  if (response.status == 200) {
    tags = response.data;
  }

  console.log(`tags=${ JSON.stringify(tags) }`);
  return tags;
}

async function listComments(octokit, owner, repo, issueNumber) {
  console.log(`owner=${ owner }, repo=${ repo }, issueNumber=${ issueNumber }`);

  var listComments = null;
  
  const response = await octokit.rest.issues.listComments({
    owner,
    repo,
    issueNumber
  });  
  console.log(`response=${ JSON.stringify(response) }`);

  if (response.status == 200) {
    listComments = response.data;
  }

  console.log(`listComments=${ JSON.stringify(listComments) }`);
  return listComments;
}

async function listCommentsForCommit(octokit, owner, repo, commitSHA) {
  console.log(`owner=${ owner }, repo=${ repo }, commitSHA=${ commitSHA }`);

  var listComments_forCommit = null;
  
  const response = await octokit.rest.repos.listCommentsForCommit({
    owner,
    repo,
    commitSHA
  });
  console.log(`response=${ JSON.stringify(response) }`);

  if (response.status == 200) {
    listComments_forCommit = response.data;
  }

  console.log(`listComments_forCommit=${ JSON.stringify(listComments_forCommit) }`);
  return listComments_forCommit;
}

async function listPullRequestsAssociatedWithCommit(octokit, owner, repo, commitSHA) {
  console.log(`owner=${ owner }, repo=${ repo }, commitSHA=${ commitSHA }`);

  var listPull_requestsAssociated_withCommit = null;
  
  const response = await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
    owner,
    repo,
    commitSHA
  });
  console.log(`response=${ JSON.stringify(response) }`);

  if (response.status == 200) {
    listPull_requestsAssociated_withCommit = response.data;
  }

  console.log(`listPull_requestsAssociated_withCommit=${ JSON.stringify(listPull_requestsAssociated_withCommit) }`);
  return listPull_requestsAssociated_withCommit;
}

async function listReviewComments(octokit, owner, repo, pullNumber) {
  console.log(`owner=${ owner }, repo=${ repo }, pullNumber=${ pullNumber }`);

  var listReview_comments = null;
  
  const response = await octokit.rest.pulls.listReviewComments({
    owner,
    repo,
    pullNumber
  });
  console.log(`response=${ JSON.stringify(response) }`);

  if (response.status == 200) {
    listReview_comments = response.data;
  }

  console.log(`listReview_comments=${ JSON.stringify(listReview_comments) }`);
  return listReview_comments;
}

async function listReviews(octokit, owner, repo, pullNumber) {
  console.log(`owner=${ owner }, repo=${ repo }, pullNumber=${ pullNumber }`);

  var listReviews = null;
  
  const response = await octokit.rest.pulls.listReviews({
    owner,
    repo,
    pullNumber
  });
  console.log(`response=${ JSON.stringify(response) }`);

  if (response.status == 200) {
    listReviews = response.data;
  }

  console.log(`listReviews=${ JSON.stringify(listReviews) }`);
  return listReviews;
}

module.exports = {
  createRef,
  createTag,
  deleteRef,
  deleteSliceOfTags,
  deleteTags,
  getBranch,
  getCommit,
  getPullRequest,
  getPullsList,
  getTags,
  listComments,
  listCommentsForCommit,
  listPullRequestsAssociatedWithCommit,
  listReviewComments,
  listReviews
};